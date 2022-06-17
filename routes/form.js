import express from "express";
import Question from "../database/model/question.js";

const router = express.Router();

router.post("/question", (req, res) => {
    const { email="", message="", date=Date() } = req.body;
    const question = new Question({ email, message, date });
    question.save();
    res.json({ message: "ok" });
});

export default router;