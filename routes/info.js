import { Router } from "express";
import fetch from "node-fetch";
import Film from "../database/model/film.js";
import { getFilm, getTrailerKey, getMainInformations, getCast } from "../utils/film.js";
import { formatFilmDuration } from "../utils/formatter.js";
import { signStatus } from "../middleware/sign-status.js";
import { getUserRating, saveFilmRating, deleteFilmRating } from "../utils/database.js";
import { authClient } from "../middleware/auth-client.js";

const router = Router();
const { API_KEY_FILM: filmKey, ACCESS_USER_KEY: userKey } = process.env;

router.get("/:id", signStatus, async (req, res) => {
    const { id: filmId } = req.params;
    const { cast_limit: castLimit=15 } = req.query;
    const { email } = req.signStatus;
    const film = await getFilm(filmId);
    const userRating = await getUserRating(filmId, email);
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
        },
        signStatus: req.signStatus,
        userRating
    };
    
    res.render("film", options);
});

router.get("/:id/rating/delete", authClient, signStatus, async (req, res) => {
    const { id: filmId } = req.params;
    const { email } = req.user;
    const { sessionId } = req.signStatus;
    const rawDeleteResponse = await fetch(`https://api.themoviedb.org/3/movie/${filmId}/rating?session_id=${sessionId}&api_key=${filmKey}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    });
    const deleteResponse = await rawDeleteResponse.json();

    if (!deleteResponse.success) {
        return res.status(400).send("An error occurred");
    }

    await deleteFilmRating(filmId, email);

    res.redirect(`/info/${filmId}`);
});

router.post("/:id/rating", authClient, signStatus, async (req, res) => {
    const { isSigned, hasSessionId, sessionId } = req.signStatus;
    const { id: filmId } = req.params;
    const { email } = req.user;
    const { rate } = req.body;

    if (!(isSigned && hasSessionId)) {
        return res.redirect("/login");
    }
    if (isSigned && !hasSessionId) {
        return res.redirect("/request_token");
    }

    const rawRatingData = await fetch(`https://api.themoviedb.org/3/movie/${filmId}/rating?session_id=${sessionId}&api_key=${filmKey}`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ value: parseFloat(rate) })
    });
    const ratingData = await rawRatingData.json();

    if (!ratingData.success) {
        return res.status(400).send("An error occurred");
    }

    await saveFilmRating(filmId, email, rate);

    res.redirect(`/info/${filmId}`);
});

export default router;