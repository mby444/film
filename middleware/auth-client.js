import jwt from "jsonwebtoken";
import UserClient from "../database/model/user-client.js";

const authClient = async (req, res, next) => {
    const { ACCESS_USER_KEY: userKey } = process.env;
    const token = req.cookies.user_client_token;
    try {
        if (!token) throw new Error("Cookie expired");
        const { email } = jwt.verify(token, userKey);
        const user = await UserClient.findOne({ email });
        if (!user) throw new Error("User data not found");
        req.user = { email, hashedPassword: user.password };
        next();
    } catch (err) {
        res.redirect("/login");
    }
};

export { authClient };