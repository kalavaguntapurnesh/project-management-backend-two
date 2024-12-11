const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const docusign = require("docusign-esign");
const fs = require("fs");
const path = require("path");
const connectDB = require("./config/db.js");
const userRoutes = require("./routes/user.route.js");
const LandlordLeaseAgreement = require("./models/landlordLeaseAgreement.js");

dotenv.config();
connectDB();

console.log("Connected to MongoDB. Now going further...");
console.log("DocuSign ACCOUNT_ID:", process.env.ACCOUNT_ID);

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "CDN",
    resave: true,
    saveUninitialized: true,
  })
);

// Routes
app.use("/api/v1", userRoutes);
  
// Success route after DocuSign signing
app.get('/success', (req, res) => {
  res.send("Signature successfully updated with DocuSign!");
});

// Global error handler
app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
});

// Start the server

module.exports = app;
