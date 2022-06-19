import bcrypt from "bcryptjs";
import User from "../database/model/user.js";

const auth = async (req, res, next) => {
    const { email, password } = req.cookies;
    const loginOptions = {
        error: null
    };

    if (!(email && password)) return res.render("login", loginOptions);
    const userData = await User.findOne({ email });
    if (!userData) return res.render("login", loginOptions);
    const isValidPassword = bcrypt.compareSync(password, userData.password);
    if (!isValidPassword) return res.render("login", loginOptions);

    next();
};

export { auth };