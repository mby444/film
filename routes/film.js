import express from "express";
import { searchFilm } from "../utils/film.js";

const router = express.Router();

router.get("/search", async (req, res) => {
    const { q } = req.query;
    const films = await searchFilm(q);
    res.json(films);
});

export default router;