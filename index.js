import dotenv from "dotenv";
import "./database/connection.js";
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import indexRoute from "./routes/index.js";
import notFound from "./middleware/not-found.js";
import filmRoute from "./routes/film.js";
import formRoute from "./routes/form.js";
import adminRoute from "./routes/admin.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("./public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRoute);
app.use("/film", filmRoute);
app.use("/form", formRoute);
app.use("/admin", adminRoute);

app.use("*", notFound);

app.listen(port, () => {
    console.log(`Server running at port ${port}...`);
});