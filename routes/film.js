import express from "express";
import { searchFilms, getFilm } from "../utils/film.js";

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

export default router;