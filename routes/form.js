import express from "express";
import Sharing from "../database/model/sharing.js";

const router = express.Router();

router.post("/sharing", async (req, res) => {
    const { url="" } = req.body;
    const sharing = new Sharing({ url });
    sharing.save();
    res.json({ message: "ok" });
});

export default router;