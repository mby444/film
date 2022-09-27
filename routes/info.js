import { Router } from "express";
import Film from "../database/model/film.js";
import { getFilm, getTrailerKey, getMainInformations, getCast } from "../utils/film.js";
import { formatFilmDuration } from "../utils/formatter.js";
import { signStatus } from "../middleware/sign-status.js";

const router = Router();
const { API_KEY_FILM: filmKey, ACCESS_USER_KEY: userKey } = process.env;

router.get("/:id", signStatus, async (req, res) => {
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
        },
        signStatus: req.signStatus
    };
    
    res.render("film", options);
});

router.post("/:id/rating", signStatus, async (req, res) => {
    const { isSigned, hasSessionId } = req.signStatus;
    if (!(isSigned && hasSessionId)) {
        return res.redirect("/login");
    }
});

export default router;