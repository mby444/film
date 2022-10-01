import jwt from "jsonwebtoken";
import UserClient from "../database/model/user-client.js";

const { ACCESS_USER_KEY: userKey } = process.env;

const signStatus = async (req, res, next) => {
    const userClientToken = req.cookies.user_client_token;
    const result = {
        isSigned: false,
        hasSessionId: false,
        email: null,
        sessionId: null
    };

    if (!userClientToken) {
        req.signStatus = result;
        return next();
    }

    try {
        const { email } = jwt.verify(userClientToken, userKey);
        const user = await UserClient.findOne({ email: { $regex: new RegExp(email, "i") } });

        if (!user) {
            res.cookie("request_token", "", { maxAge: 0, httpOnly: true });
            res.cookie("user_client_token", "", { maxAge: 0, httpOnly: true });
            req.signStatus = result;
            return next();
        }

        result.isSigned = true;
        result.hasSessionId = !!user.sessionId;
        result.email = email;
        result.sessionId = user.sessionId;
        req.signStatus = result;

        next();
    } catch (err) {
        result.isSigned = false;
        result.hasSessionId = false;
        result.email = null;
        result.sessionId = null;
        req.signStatus = result;

        next();
    }
};

export { signStatus };