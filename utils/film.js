import fetch from "node-fetch";

const getFilm = async (filmId=0) => {
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
            message: err.message
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
        if (data.results.length === 0) throw { name: "NotFoundError" };
        return data;
    } 
    catch(err) {
        const errObj = {
            error: true,
            message: err.message
        };
        err.name === "NotFoundError" ? errObj.message = `${filmName} did not match any results` 
        : err.name === "UndefinedError" ? errObj.message = "Something went wrong"
        : 0;
        return errObj;
    }
};

export {
    searchFilms,
    getFilm
};