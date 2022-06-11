import mongoose from "mongoose";

const Question = mongoose.model("questions", {
    email: {
        type: String
    },
    message: {
        type: String
    },
    date: {
        type: String
    }
});

export default Question;