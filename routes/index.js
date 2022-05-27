import express from "express";
import { searchFilms } from "../utils/film.js";

const router = express.Router();

router.get("/", (req, res) => {
    const options = {
        films: null,
        filmError: null
    };

    res.render("index", options);
});

router.get("/search", async (req, res) => {
    const { q, page } = req.query;
    const films = await searchFilms(q, page);
    const filmError = films.error ? films.message : null;
    const options = {
        films,
        filmError
    };

    res.render("index", options);
});

export default router;