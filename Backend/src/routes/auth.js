const express = require("express")
const authRouter = express.Router();
const validateSignupData = require("../utils/Validation");
const { ConnectDb } = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const axios = require("axios")

authRouter.get("/", (req, res) => {
    res.redirect("/signup");
});

authRouter.get("/signup", (req, res) => {
    res.render("signup");
});

authRouter.post("/signup", async (req, res) => {
    try {
        validateSignupData(req);

        const { username, email, password } = req.body;
        const client = await ConnectDb();

        const existing = await client.query(
            "Select * from users where email = $1 OR username = $2",
            [email, username]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: "Username or Email already exists" });
        };

        const hashPassword = await bcrypt.hash(password, 10);

        const result = await client.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
            [username, email, hashPassword]
        );

        return res.render("signup", {
            message: "Registration successful. Please Log in"
        });

    }
    catch (err) {
        res.render("signup", { error: "An error occurred during registration." });
    }
});

authRouter.get("/login", (req, res) => {
    res.render("login");
});


authRouter.post("/login", async (req, res) => {
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
        };

        const client = await ConnectDb();

        const result = await client.query(
            "Select * from users where email = $1",
            [email]
        );

        const user = result.rows[0];

        if (!user) {
            return res.status(404).send("User not found");
        };

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).send("Incorrect Password")
        }

        const token = jwt.sign({
            id: user.id,
            username: user.username,
            email: user.email
        },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        res.cookie("token", token);
        return res.redirect("/profile");

    }
    catch (err) {
        console.error(err);
        return res.render("login", { error: "Something went wrong. Try again." });
    }
})

authRouter.post("/logout", async (rq, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    });

    res.redirect("/login");
})
module.exports = authRouter