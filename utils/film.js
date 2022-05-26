import { Tmdb, NotFoundError } from "tmdb";
import fetch from "node-fetch";

const tmdb = new Tmdb(process.env.API_KEY_FILM);

const searchFilm = async (filmName="") => {
    if (!filmName) return {};
    try {
        const films = await fetch(`https://api.themoviedb.org/3/search/movie?query=${filmName}&api_key=${process.env.API_KEY_FILM}`);
        const data = await films.json();
        if (data.results.length === 0) throw { name: "NotFoundError" };
        return data;
    } 
    catch(err) {
        const errObj = {
            error: true,
            message: err.message
        }
        err.name === "NotFoundError" ? errObj.message = `${filmName} did match any results` : 0;
        return errObj;
    }
};

export {
    searchFilm
};