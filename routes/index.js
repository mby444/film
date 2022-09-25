import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fetch from "node-fetch";
import Film from "../database/model/film.js";
import UserClient from "../database/model/user-client.js";
import { authClient } from "../middleware/auth-client.js";
import { signStatus } from "../middleware/sign-status.js";
import { 
    searchFilms,
    getFilm,
    getTrendings,
    getTrailerKey,
    getMainInformations,
    getCast
} from "../utils/film.js";
import { formatFilmDuration } from "../utils/formatter.js";

const router = express.Router();
const { ACCESS_USER_KEY: userKey, API_KEY_FILM: filmKey } = process.env;

router.get("/", signStatus, async (req, res) => {
    const { page=1 } = req.query;
    const films = await getTrendings(page);
    const pageTotal = films.total_pages;
    const filmError = films.error ? films.message : null;
    const options = {
        query: null,
        pageTotal,
        page,
        films,
        filmError,
        signStatus: req.signStatus
    };

    res.render("index", options);
});

router.get("/search", signStatus, async (req, res) => {
    const { q, page } = req.query;
    const films = await searchFilms(q, page);
    const pageTotal = films.total_pages;
    const filmError = films.error ? films.message : null;
    const options = {
        query: q,
        pageTotal,
        page: page || 1,
        films,
        filmError,
        signStatus: req.signStatus
    };

    res.render("index", options);
});

router.get("/info/:id", async (req, res) => {
    const { id: filmId } = req.params;
    const { cast_limit: castLimit=15 } = req.query;
    const film = await getFilm(filmId);
    const { castCount, casts } = await getCast(filmId, castLimit);

    if (film.error) {
        return res.status(400).send(film.message);
    }
    film.casts = casts;
    film.castCount = castCount;

    const mainInformations = getMainInformations(film);
    const trailerKey = await getTrailerKey(filmId);
    const filmDB = await Film.findOne({ filmId }).exec();

    if (filmDB) {
        film.watchURL = filmDB.url;
        film.note = filmDB.note;
    }

    const options = {
        film,
        mainInformations,
        trailerKey,
        utils: {
            formatFilmDuration
        }
    };
    
    res.render("film", options);
});

router.get("/signup", (req, res) => {
    const { originalUrl } = req;
    const options = {
        error: null,
        title: "Sign Up",
        type: "signup",
        originalUrl
    };

    res.render("client-sign", options);
});

router.get("/login", (req, res) => {
    const { originalUrl } = req;
    const options = {
        error: null,
        title: "Log In",
        type: "login",
        originalUrl
    };

    res.render("client-sign", options);
});

router.get("/sign_choice", authClient, (req, res) => {
    res.render("sign-choice");
});

router.get("/request_token", authClient, async (req, res) => {
    const { hostname, protocol } = req;
    const { PORT: port } = process.env;
    const fullUrl = `${protocol}://${hostname}:${port}/session`;
    const rawReqToken = await fetch(`https://api.themoviedb.org/3/authentication/token/new?api_key=${filmKey}`);
    const { request_token: reqToken } = await rawReqToken.json();

    res.cookie("request_token", reqToken, { maxAge: 1000 * 60 * 60, httpOnly: true });
    res.redirect(`https://www.themoviedb.org/authenticate/${reqToken}?redirect_to=${fullUrl}`);
});

router.get("/session", authClient, async (req, res) => {
    const reqToken = req.cookies.request_token;
    const { email } = req.user;
    const { originalUrl } = req;
    try {
        if (!reqToken) throw new Error("Session expired");
        const rawSessionId = await fetch(`https://api.themoviedb.org/3/authentication/session/new?api_key=${filmKey}`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                request_token: reqToken
            })
        });
        const { session_id: sessionId } = await rawSessionId.json();

        if (!sessionId) {
            return res.redirect("/");
        }

        await UserClient.updateOne({ email }, { $set: { sessionId } });

        res.cookie("request_token", {}, { maxAge: 0, httpOnly: true });
        res.redirect("/");
    } catch (err) {
        const options = {
            error: err.message,
            title: "Log In",
            type: "login",
            originalUrl
        };

        res.cookie("request_token", {}, { maxAge: 0, httpOnly: true });
        res.render("client-sign", options);
    }
});

router.get("/logout", async (req, res) => {
    res.cookie("user_client_token", "", { maxAge: 0, httpOnly: true });
    res.redirect("/");
});

router.post("/signup", async (req, res) => {
    const { email, password, original_url: originalUrl } = req.body;
    const options = {
        error: null,
        title: "Sign Up",
        type: "signup",
        originalUrl
    };
    const oldUser = await UserClient.findOne({ email });

    if (password.length < 8) {
        options.error = "Password must be at least 8 characters length";
        return res.render("client-sign", options);
    }
    if (oldUser) {
        options.error = "User already exists, please login";
        return res.render("client-sign", options);
    }

    const userClientToken = jwt.sign({ email }, userKey, { expiresIn: "1h" });
    const hashedPassword = await bcrypt.hash(password, 16);
    await UserClient.create({ email, password: hashedPassword });

    res.cookie("user_client_token", userClientToken, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
    res.redirect("/sign_choice");
});

router.post("/login", async (req, res) => {
    const { email, password, original_url: originalUrl } = req.body;
    const options = {
        error: null,
        title: "Log In",
        type: "login",
        originalUrl
    };
    const user = await UserClient.findOne({ email });
    
    if (!user) {
        options.error = "You have not signed yet, please sign up";
        return res.render("client-sign", options);
    }
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        options.error = "In valid password";
        return res.render("client-sign", options);
    }

    const userClientToken = jwt.sign({ email }, userKey, { expiresIn: "1h" });

    res.cookie("user_client_token", userClientToken, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
    
    if (!user.sessionId) {
        return res.redirect("/sign_choice");
    }
    res.redirect("/");
});

export default router;