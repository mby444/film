import express from "express";
import fs from "fs/promises";
import path from "path";
import User from "../database/model/user.js";
import { collectionObj, collectionName } from "../utils/collection.js";
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

router.get("/collection", auth, async (req, res) => {
    const { name: collName="" } = req.query;
    const options = {
        data: [],
        collName
    };
    options.data = await collectionObj[collName]();

    res.render("collection", options);
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

router.delete("/collection", async (req, res) => {
    const { id="", name="", all="0" } = req.query;
    const Model = collectionName[name]();
    const options = {
        message: ""
    }

    if (all === "1") {
        let dropped = await Model.deleteMany({});
        options.message = dropped ? "Successfully delete all data!" : "Can't delete data!";
    } 
    else if (id && name) {
        let deleted = await Model.deleteOne({ _id: id });
        options.message = deleted ? "Succesfully delete data!" : "Can't delete data!"
    } else {
        options.message = "an error occur";
    }

    res.json(options);
});

export default router;