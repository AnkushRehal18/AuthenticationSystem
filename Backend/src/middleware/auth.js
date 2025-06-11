const jwt = require("jsonwebtoken");
const { ConnectDb } = require("../config/database");

const userAuth = async (req, res, next) => {
    try {
        const cookies = req.cookies;

        const { token } = cookies;

        if (!token) {
            return res.status(400).json({ message: "Please Login!!!" });
        }

        const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);

        const userId = decodedObj.id;

        const client = await ConnectDb();

        const result = await client.query(
            "SELECT id, username, email, created_at FROM users WHERE id = $1",
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = result.rows[0];

        next()
    }
    catch (err) {
        res.status(400).send("Error" + err)
    }
}

module.exports = userAuth;