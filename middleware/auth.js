import bcrypt from "bcryptjs";
import User from "../database/model/user.js";

const auth = async (req, res, next) => {
    const { originalUrl } = req;
    const { email, password } = req.cookies;
    const encOriginalUrl = encodeURIComponent(originalUrl);
    
    if (!(email && password)) return res.redirect(`/admin/login?original_url=${encOriginalUrl}`);
    const userData = await User.findOne({ email });
    if (!userData) return res.redirect(`/admin/login?original_url=${encOriginalUrl}&error=invalid`);
    const isValidPassword = bcrypt.compareSync(password, userData.password);
    if (!isValidPassword) return res.redirect(`/admin/login?original_url=${encOriginalUrl}&error=invalid`);

    next();
};

export { auth };