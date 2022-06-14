import express from "express";
import User from "../database/model/user.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, (req, res) => {
    res.render("admin");
});

router.post("/logged", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
        return res.render("login", { error: "Invalid email or password!" });
    }
    
    res.cookie("email", email, { maxAge: 1000 * 60 * 60, httpOnly: true });
    res.cookie("password", password, { maxAge: 1000 * 60 * 60, httpOnly: true });
    res.render("logged");
});

export default router;