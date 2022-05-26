import { Tmdb, NotFoundError } from "tmdb";
import fetch from "node-fetch";

const tmdb = new Tmdb(process.env.API_KEY_FILM);

const searchFilm = async (filmName="") => {
    if (!filmName) return {};
    try {
        const films = await fetch(`https://api.themoviedb.org/3/search/movie?query=${filmName}&api_key=${process.env.API_KEY_FILM}`);
        const data = films.json();
        return data;
    } catch(err) {
        let errObj = {
            error: true,
            message: err.message
        };
        if (err instanceof NotFoundError) {
            errObj.message = `${filmName} did not match any results`;
        }
        return errObj;
    }
};

export {
    searchFilm
};