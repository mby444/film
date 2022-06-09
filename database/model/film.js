import mongoose from "mongoose";

const Film = mongoose.model("films", {
    filmId: {
        type: String
    },
    url: {
        type: String
    }
});

export default Film;