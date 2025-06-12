// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const validateSignupData = require("../utils/Validation");
const User = require("../models/userModel");

exports.getSignupPage = (req, res) => {
    res.render("signup");
};

exports.signup = async (req, res) => {
    try {
        validateSignupData(req);
        const { username, email, password } = req.body;

        const existing = await User.findUserByEmailOrUsername(email, username);
        if (existing.length > 0) {
            return res.status(400).json({ error: "Username or Email already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        await User.createUser(username, email, hashPassword);

        return res.render("signup", {
            message: "Registration successful. Please Log in"
        });
    } catch (err) {
        console.log(err)
        res.render("signup", { error: "An error occurred during registration." });
    }
};

exports.getLoginPage = (req, res) => {
    res.render("login");
};

exports.login = async (req, res) => {
    const { email, password, "g-recaptcha-response": recaptchaToken } = req.body;

    if (!recaptchaToken) {
        return res.render("login", { error: "Please complete the reCAPTCHA." });
    }

    try {
        const captchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
        const response = await axios.post(captchaVerifyUrl, null, {
            params: {
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: recaptchaToken
            }
        });

        const { success } = response.data;
        if (!success) {
            return res.render("login", { error: "Invalid reCAPTCHA. Please try again." });
        }

        const user = await User.findUserByEmail(email);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send("Incorrect Password");
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        res.cookie("token", token);
        return res.redirect("/profile");
    } catch (err) {
        console.error(err);
        return res.render("login", { error: "Something went wrong. Try again." });
    }
};

exports.logout = (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.redirect("/login");
};
