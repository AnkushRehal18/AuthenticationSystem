const express = require("express")
const app = express();
const cookieParser = require("cookie-parser");
const {ConnectDb} = require("./config/database");
const authRouter = require('./routes/auth');

require('dotenv').config();
app.use(express.json());
app.use(cookieParser());
app.use("/",authRouter);

ConnectDb().then((client) => {
  console.log("connected to database successfully");
  app.listen(process.env.PORT, () => {
    console.log("Server is successfully listening on port 3000");
  });
}).catch((err) => {
  console.log("Database cannot be connected", err);
});

