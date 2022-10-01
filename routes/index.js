import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fetch from "node-fetch";
import UserClient from "../database/model/user-client.js";
import { authClient } from "../middleware/auth-client.js";
import { signStatus } from "../middleware/sign-status.js";
import { searchFilms, getTrendings } from "../utils/film.js";

const router = express.Router();
const { ACCESS_USER_KEY: userKey, API_KEY_FILM: filmKey, BASE_URL: baseUrl } = process.env;

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

router.get("/signup", (req, res) => {
    const { originalUrl } = req;
    const { redirect_to: redirectTo="/" } = req.query;
    const options = {
        error: null,
        title: "Sign Up",
        type: "signup",
        originalUrl,
        redirectTo
    };

    res.render("client-sign", options);
});

router.get("/login", (req, res) => {
    const { originalUrl } = req;
    const { redirect_to: redirectTo="/" } = req.query;
    const options = {
        error: null,
        title: "Log In",
        type: "login",
        originalUrl,
        redirectTo
    };

    res.render("client-sign", options);
});

router.get("/sign_choice", authClient, async (req, res) => {
    const { redirect_to: redirectTo="/" } = req.query;
    const { email } = req.user;
    const decRedirectTo = decodeURIComponent(redirectTo);
    const emailRegex = new RegExp(email, "i");
    const user = await UserClient.find({ email: { $regex: emailRegex } });
    const options = {
        redirectTo: decRedirectTo
    }

    if (user.length > 1) {
        await UserClient.deleteMany({ email: { $regex: emailRegex } });
        await UserClient.create({ email, password: user[0].password });
    }

    res.render("sign-choice", options);
});

router.get("/request_token", authClient, async (req, res) => {
    const { redirect_to: redirectTo="/" } = req.query;
    const encRedirectTo = encodeURIComponent(redirectTo);
    const fullUrl = `${baseUrl}/session?redirect_to=${encRedirectTo}`;
    const rawReqToken = await fetch(`https://api.themoviedb.org/3/authentication/token/new?api_key=${filmKey}`);
    const { request_token: reqToken } = await rawReqToken.json();

    res.cookie("request_token", reqToken, { maxAge: 1000 * 60 * 60, httpOnly: true });
    res.redirect(`https://www.themoviedb.org/authenticate/${reqToken}?redirect_to=${fullUrl}`);
});

router.get("/session", authClient, async (req, res) => {
    const reqToken = req.cookies.request_token;
    const { redirect_to: redirectTo="/" } = req.query;
    const { email } = req.user;
    const { originalUrl } = req;
    const decRedirectTo = decodeURIComponent(redirectTo);
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
            return res.status(500).send("An error occurred");
        }

        await UserClient.updateOne({ email }, { $set: { sessionId } });

        res.cookie("request_token", {}, { maxAge: 0, httpOnly: true });
        res.redirect(decRedirectTo);
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
    const { redirect_to: redirectTo="/" } = req.query;
    const encRedirectTo = encodeURIComponent(redirectTo);
    const options = {
        error: null,
        title: "Sign Up",
        type: "signup",
        originalUrl,
        redirectTo
    };
    const oldUser = await UserClient.findOne({ email: { $regex: new RegExp(email, "i") } });

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
    res.redirect(`/sign_choice?redirect_to=${encRedirectTo}`);
});

router.post("/login", async (req, res) => {
    const { email, password, original_url: originalUrl } = req.body;
    const { redirect_to: redirectTo="/" } = req.query;
    const options = {
        error: null,
        title: "Log In",
        type: "login",
        originalUrl
    };
    const user = await UserClient.findOne({ email: { $regex: new RegExp(email, "i") } });
    
    if (!user) {
        options.error = "You have not signed yet, please sign up";
        return res.render("client-sign", options);
    }
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        options.error = "Invalid password";
        return res.render("client-sign", options);
    }

    const userClientToken = jwt.sign({ email }, userKey, { expiresIn: "1h" });

    res.cookie("user_client_token", userClientToken, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
    
    if (!user.sessionId) {
        return res.redirect("/sign_choice");
    }
    res.redirect(redirectTo);
});

export default router;