import mongoose from "mongoose";

const FilmRating = mongoose.model("film_ratings", {
    filmId: {
        type: String
    },
    ratings: [
        {
            email: { type: String },
            value: { type: Number }
        }
    ]
});

export default FilmRating;