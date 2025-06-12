const express = require("express")
const authRouter = express.Router();
const validateSignupData = require("../utils/Validation");
const { ConnectDb } = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const axios = require("axios")
const authController = require("../controller/authController");

authRouter.get("/", (req, res) => {
    res.redirect("/signup");
});

authRouter.get("/signup",authController.getSignupPage);

authRouter.post("/signup",authController.signup);

authRouter.get("/login", authController.getLoginPage);

authRouter.post("/login",authController.login);

authRouter.post("/logout", authController.logout);

module.exports = authRouter