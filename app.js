const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db.js");
const userRoutes = require("./routes/user.route.js");

dotenv.config();
connectDB();

console.log("Conncected to mongodb. Now going further...");

const app = express();
app.use(express.json());
app.use(cors());

app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/v1", userRoutes);

app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
});

app.get("/", (req, res) => {
  res.json("Hello World");
});

module.exports = app;
