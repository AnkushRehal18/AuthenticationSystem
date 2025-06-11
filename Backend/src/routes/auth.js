const express = require("express")
const authRouter = express.Router();
const validateSignupData = require("../utils/Validation");
const { ConnectDb } = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

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

        return res.status(201).json({
            message: "Registration successful. Please log in.",
            user: result.rows[0]
        });

    }
    catch (err) {
        res.status(400).send("Error" + err)
    }
});

authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
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

        res.cookie("token",token);
        res.status(200).json({message :"Login successful",user})

    }
    catch (err) {
        res.status(400).send("Error" + err);
    }
})

authRouter.post("/logout", async(rq,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now())
    });

    res.status(200).send("Logged Out successfully")
})
module.exports = authRouter