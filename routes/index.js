import express from "express";
import Film from "../database/model/film.js";
import { 
    searchFilms,
    getFilm,
    getTopFilms,
    getTrendings,
    getTrailerKey,
    getMainInformations,
    getCast
} from "../utils/film.js";
import { formatFilmDuration } from "../utils/formatter.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const { page=1 } = req.query;
    // const films = await getTopFilms(page);
    const films = await getTrendings(page);
    const pageTotal = films.total_pages;
    const filmError = films.error ? films.message : null;
    const options = {
        query: null,
        pageTotal,
        page,
        films,
        filmError
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

export default router;