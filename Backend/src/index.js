const express = require("express")
const app = express();
const cookieParser = require("cookie-parser");
const {ConnectDb} = require("./config/database");
const authRouter = require('./routes/auth');
const profileRouter = require("./routes/profile");
const path = require("path");


require('dotenv').config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use("/",authRouter);
app.use("/",profileRouter);

ConnectDb().then((client) => {
  console.log("connected to database successfully");
  app.listen(process.env.PORT, () => {
    console.log("Server is successfully listening on port 3000");
  });
}).catch((err) => {
  console.log("Database cannot be connected", err);
});

