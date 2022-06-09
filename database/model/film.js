import mongoose from "mongoose";

const Film = mongoose.model("films", {
    name: {
        type: String
    },
    url: {
        type: String
    }
});

export default Film;