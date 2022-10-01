import jwt from "jsonwebtoken";
import User from "../database/model/user.js";

const { ACCESS_KEY: accesskey } = process.env;

const auth = async (req, res, next) => {
    const { originalUrl } = req;
    const userToken = req.cookies.user_token;
    const encOriginalUrl = encodeURIComponent(originalUrl);

    try {
        const user = jwt.verify(userToken, accesskey);

        if (!userToken) return res.redirect(`/admin/login?original_url=${encOriginalUrl}`);
        const userData = await User.findOne({ email: { $regex: new RegExp(user.email, "i") } });
        if (!userData) return res.redirect(`/admin/login?original_url=${encOriginalUrl}&error=invalid`);

        req.user = user;

        next();
    } catch (err) {
        res.redirect(`/admin/login?original_url=${encOriginalUrl}`);
    }
};

export { auth };