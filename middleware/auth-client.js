import jwt from "jsonwebtoken";
import UserClient from "../database/model/user-client.js";

const authClient = async (req, res, next) => {
    const { ACCESS_USER_KEY: userKey } = process.env;
    const token = req.cookies.user_client_token;
    try {
        if (!token) throw new Error("Cookie expired");
        const { email } = jwt.verify(token, userKey);
        const hashedPassword = await UserClient.findOne({ email });
        const user = { email, hashedPassword };
        req.user = user;
        next();
    } catch (err) {
        res.redirect("/login");
    }
};

export { authClient };