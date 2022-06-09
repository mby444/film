import dotenv from "dotenv";
import "./database/connection.js";
import express from "express";
import bodyParser from "body-parser";
import indexRoute from "./routes/index.js";
import notFound from "./middleware/not-found.js";
import filmRoute from "./routes/film.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("./public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", indexRoute);
app.use("/film", filmRoute);
app.use("*", notFound);

app.listen(port, () => {
    console.log(`Server running at port ${port}...`);
});