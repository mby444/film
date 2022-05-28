import dotenv from "dotenv";
import fetch from "node-fetch";
import { Tmdb } from "tmdb";

dotenv.config();

const tmdb = new Tmdb(process.env.API_KEY_FILM);

const getFilm = async (filmId="") => {
    try {
        if (!filmId) throw { name: "UndefinedError" };
        const film = await fetch(`https://api.themoviedb.org/3/movie/${filmId}?api_key=${process.env.API_KEY_FILM}`);
        const data = await film.json();
        if (data.status_code === 34) throw { name: "NotFoundError" };
        return data;
    }
    catch (err) {
        const errObj = {
            error: true,
            message: "Something went wrong"
        };
        err.name === "NotFoundError" ? errObj.message = `Film with id ${filmId} not found` 
        : err.name === "UndefinedError" ? errObj.message = "Something went wrong"
        : 0;
        return errObj;
    }
}

const searchFilms = async (filmName="", page=1) => {
    try {
        if (!filmName) throw { name: "UndefinedError" };
        const films = await fetch(`https://api.themoviedb.org/3/search/movie?query=${filmName}&page=${page}&api_key=${process.env.API_KEY_FILM}`);
        const data = await films.json();
        data.results = data.results.filter((result) => result.vote_average && result.poster_path);
        if (page < 1 || page > data.total_pages) throw { name: "OutOfRange" };
        if (data.results.length === 0) throw { name: "NotFoundError" };
        return data;
    } 
    catch(err) {
        const errObj = {
            error: true,
            message: "Something went wrong"
        };
        err.name === "OutOfRange" ? errObj.message = "Page not found"
        : err.name === "NotFoundError" ? errObj.message = `"${filmName}" did not match any results` 
        : err.name === "UndefinedError" ? errObj.message = "Something went wrong"
        : 0;
        return errObj;
    }
};

const getOfficialTrailer = (trailers=[]) => {
    let output = trailers[0];
    trailers.forEach((trailer, i) => {
        let outputPublishTime = output.publishedAt ? new Date(output.publishedAt).getTime() : 0;
        let publishTime = new Date(trailer.publishedAt).getTime();
        if (outputPublishTime > publishTime) {
            output = trailer;
        }
    });
    return output;
};

const getTrailerKey = async (filmId) => {
    const rawTrailers = await tmdb.getMovieVideos(filmId);
    const trailer = getOfficialTrailer(rawTrailers);
    const key = trailer ? trailer.key : "";
    return key;
};

export {
    searchFilms,
    getFilm,
    getTrailerKey
};