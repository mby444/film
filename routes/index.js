import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    const options = {
        
    };

    res.render("index", options);
});

export default router;