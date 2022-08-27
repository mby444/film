import express from "express";
import Request from "../database/model/request.js";
import { searchFilms, getFilm } from "../utils/film.js";
import { getCast } from "../utils/film.js";

const router = express.Router();

router.get("/id/:id", async (req, res) => {
    const { id } = req.params;
    const film = await getFilm(id);
    res.json(film);
});

router.get("/search", async (req, res) => {
    const { q } = req.query;
    const films = await searchFilms(q);
    res.json(films);
});

router.get("/req", async (req, res) => {
    const { id: filmId=0 } = req.query;
    const requests = await Request.find({ filmId });
    res.json({ count: requests.length });
});

router.get("/cast/:filmId", async (req, res) => {
    const { filmId } = req.params;
    const result = {
        error: null,
        data: []
    };
    try {
        const { casts } = await getCast(filmId);
        result.data = casts;
    } catch (err) {
        result.error = err.message;
    }

    res.json(result);
});

router.post("/req", (req, res) => {
    const { filmId, filmTitle, filmDate } = req.body;
    const request = new Request({ filmId, filmTitle, date: filmDate });
    request.save();
    res.json({ message: "ok" });
});

export default router;