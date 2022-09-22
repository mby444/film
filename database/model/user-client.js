import mongoose from "mongoose";

const UserClient = mongoose.model("user_clients", {
    email: {
        type: String
    },
    password: {
        type: String
    },
    sessionId: {
        type: String
    }
});

export default UserClient;