import mongoose from "mongoose";

const Sharing = mongoose.model("sharings", {
    filmId: {
        type: String
    },
    url: {
        type: String
    },
    date: {
        type: String
    }
});

export default Sharing;