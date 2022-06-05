import express from "express";
import { searchFilms, getFilm, getTrailerKey, getMainInformations } from "../utils/film.js";
import { formatFilmDuration } from "../utils/formatter.js";

const router = express.Router();

router.get("/", (req, res) => {
    const options = {
        query: null,
        pageTotal: null,
        page: null,
        films: null,
        filmError: null
    };

    res.render("index", options);
});

router.get("/search", async (req, res) => {
    const { q, page } = req.query;
    const films = await searchFilms(q, page);
    const pageTotal = films.total_pages;
    const filmError = films.error ? films.message : null;
    const options = {
        query: q,
        pageTotal,
        page: page || 1,
        films,
        filmError
    };

    res.render("index", options);
});

router.get("/info/:id", async (req, res) => {
    const { id: filmId } = req.params;
    const film = await getFilm(filmId);
    const mainInformations = getMainInformations(film);
    const trailerKey = await getTrailerKey(filmId);
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

export default router;