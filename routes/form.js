import express from "express";
import Sharing from "../database/model/sharing.js";

const router = express.Router();

router.post("/sharing", async (req, res) => {
    const { url="", date=Date() } = req.body;
    const sharing = new Sharing({ url, date });
    sharing.save();
    res.json({ message: "ok" });
});

export default router;