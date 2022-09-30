import Request from "../database/model/request.js";
import FilmRating from "../database/model/film-rating.js";

const saveReq = async (filmId, filmTitle, filmDate) => {
    const oldRequest = await Request.findOne({ filmId });
    if (oldRequest && oldRequest.total) {
        await Request.updateOne({ filmId }, {
            $set: {
                total: oldRequest.total + 1
            }
        });
    } else {
        const request = new Request({ filmId, filmTitle, date: filmDate, total: 1 });
        await request.save();
    }
};

const getUserRating = async (filmId, email) => {
    const filmRating = await FilmRating.findOne({ filmId });
    if (!(email && filmRating)) return null;

    const userRating = filmRating.ratings.find((rating) => {
        return rating.email === email.toLowerCase();
    });
    
    return userRating;
};

const saveFilmRating = async (filmId, email, value) => {
    const filmRating = await FilmRating.findOne({ filmId });

    if (filmRating) {
        const userRatingIndex = filmRating.ratings.findIndex((rating) => {
            return email.toLowerCase() === rating.email
        });

        const ratings = Object.assign([], filmRating.ratings);

        if (userRatingIndex !== -1) ratings[userRatingIndex].value = parseFloat(value);
        else ratings.push({ email: email.toLowerCase(), value: parseFloat(value) });

        await FilmRating.updateOne({ filmId }, { $set: { ratings } });
    } else {
        await FilmRating.create({
            filmId,
            ratings: [{
                email: email.toLowerCase(),
                value: parseFloat(value)
            }]
        });
    }
};

const deleteFilmRating = async (filmId, email) => {
    const filmRating = await FilmRating.findOne({ filmId });
    if (!filmRating) return;

    filmRating.ratings = filmRating.ratings.filter((rating) => {
        return rating.email !== email.toLowerCase();
    });

    if (!filmRating.ratings.length) {
        await FilmRating.deleteOne({ filmId });
        return;
    }

    await FilmRating.updateOne({ filmId }, {
        $set: {
            ratings: filmRating.ratings
        }
    });
};

export { saveReq, getUserRating, saveFilmRating, deleteFilmRating };