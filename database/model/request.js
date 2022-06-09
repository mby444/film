import mongoose from "mongoose";

const Request = mongoose.model("requests", {
    filmId: {
        type: String
    },
    filmTitle: {
        type: String
    },
    date: {
        type: String
    }
});

export default Request;