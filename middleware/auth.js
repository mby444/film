import User from "../database/model/user.js";

const auth = async (req, res, next) => {
    const { email, password } = req.cookies;
    const loginOptions = {
        error: null
    };

    if (!(email && password)) return res.render("login", loginOptions);
    const userData = await User.findOne({ email, password });
    if (!userData) return res.render("login", loginOptions);

    next();
};

export { auth };