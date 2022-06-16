import express from "express";
import fs from "fs/promises";
import path from "path";
import User from "../database/model/user.js";
import { auth } from "../middleware/auth.js";
import { __dirname } from "../config/path.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
    const options = {
        collections: []
    };
    const collectionsBuffer = await fs.readFile(path.resolve(__dirname, "../database/json/collection.json"));
    const collections = JSON.parse(collectionsBuffer.toString());
    options.collections = collections;

    res.render("admin", options);
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