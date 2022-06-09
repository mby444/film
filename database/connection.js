import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

mongoose.connect(process.env.MONGO_URI, (err) => {
    if (err) return console.log(err);
    console.log("MongoDB connected!");
});