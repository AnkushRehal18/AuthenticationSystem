// models/UserModel.js
const { ConnectDb } = require("../config/database");

async function findUserByEmailOrUsername(email, username) {
    const client = await ConnectDb();
    const result = await client.query(
        "SELECT * FROM users WHERE email = $1 OR username = $2",
        [email, username]
    );
    return result.rows;
}

async function createUser(username, email, hashedPassword) {
    const client = await ConnectDb();
    const result = await client.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
        [username, email, hashedPassword]
    );
    return result.rows[0];
}

async function findUserByEmail(email) {
    const client = await ConnectDb();
    const result = await client.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
}

module.exports = {
    findUserByEmailOrUsername,
    createUser,
    findUserByEmail
};
