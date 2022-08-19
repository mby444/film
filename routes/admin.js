import express from "express";
import fs from "fs/promises";
import bcrypt from "bcryptjs";
import path from "path";
import User from "../database/model/user.js";
import Film from "../database/model/film.js";
import Request from "../database/model/request.js";
import { collectionObj, collectionName, sortCollection } from "../utils/collection.js";
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
    const { name: collName="", limit: collLimit=15, page=1, sort="newest" } = req.query;
    const limit = parseInt(collLimit);
    const options = {
        data: [],
        collName,
        count: { row: 0 },
        currentPage: parseInt(page),
        maxPage: 1,
        sort
    };
    const collections = await collectionObj[collName]();
    const sortedCollections = sortCollection(collections, sort);
    options.data = sortedCollections.slice(limit * (page - 1), limit * page);
    options.count.row = options.data.length;
    options.maxPage = Math.ceil(collections.length / limit);

    res.render("collection", options);
});

router.get("/user/new", auth, (req, res) => {
    const options = {
        error: null
    }
    res.render("new-user", options);
});

router.get("/film/edit", auth, (req, res) => {
    const { id, url, note } = req.query;
    const options = {
        id,
        url,
        note,
        error: null
    }
    res.render("edit-film", options);
});

router.post("/user/new", async (req, res) => {
    const { email, password } = req.body;
    const oldUser = await User.findOne({ email });
    if (oldUser) return res.render("new-user", { error: "User already exists!" });
    const passwordHash = bcrypt.hashSync(password);
    const newUser = new User({ email, password: passwordHash });
    await newUser.save();
    res.redirect("/admin/collection?name=users");
});

router.post("/logged", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.render("login", { error: "Invalid email or password!" });
    }
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
        return res.render("login", { error: "Invalid password!" });
    }
    
    res.cookie("email", email, { maxAge: 1000 * 60 * 60, httpOnly: true });
    res.cookie("password", password, { maxAge: 1000 * 60 * 60, httpOnly: true });
    res.render("logged");
});

router.post("/film", async (req, res) => {
    const { filmId, filmTitle, date, url } = req.body;
    const oldFilm = await Film.findOne({ filmId });
    if (oldFilm) return res.json({ error: true, message: "Film already exists!" });
    const newFilm = new Film({ filmId, filmTitle, date, url });
    await newFilm.save();
    await Request.deleteMany({ filmId });
    res.json({ message: "ok" });
});

router.post("/film/edit", async (req, res) => {
    const { id, url, note } = req.body;
    await Film.updateOne({ filmId: id }, {
        $set: { url, note }
    });
    res.redirect("/admin/collection?name=films");
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

router.delete("/logout", (req, res) => {
    res.cookie("email", "", { maxAge: 0 });
    res.cookie("password", "", { maxAge: 0 });
    res.json({ message: "ok" });
});

export default router;