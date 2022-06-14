import mongoose from "mongoose";

const User = mongoose.model("users", {
    email: {
        type: String
    },
    password: {
        type: String
    }
});

export default User;