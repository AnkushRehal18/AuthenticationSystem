const express = require("express");

const profileRouter = express.Router();


profileRouter.get("/profile" , async(req,res)=>{
    res.status(200).send("This is your profile boy");
})