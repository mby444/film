import express from "express";
import Sharing from "../database/model/sharing.js";
import Question from "../database/model/question.js";

const router = express.Router();

router.post("/sharing", (req, res) => {
    const { url="", date=Date() } = req.body;
    const sharing = new Sharing({ url, date });
    sharing.save();
    res.json({ message: "ok" });
});

router.post("/question", (req, res) => {
    const { email="", message="", date=Date() } = req.body;
    const question = new Question({ email, message, date });
    question.save();
    res.json({ message: "ok" });
});

export default router;