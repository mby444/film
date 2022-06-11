import mongoose from "mongoose";

const Sharing = mongoose.model("sharings", {
    url: {
        type: String
    },
    date: {
        type: String
    }
});

export default Sharing;