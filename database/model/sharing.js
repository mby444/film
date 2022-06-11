import mongoose from "mongoose";

const Sharing = mongoose.model("sharings", {
    url: {
        type: String
    }
});

export default Sharing;