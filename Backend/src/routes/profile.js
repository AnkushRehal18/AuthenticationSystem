const express = require("express");
const userAuth = require("../middleware/auth");
const { ConnectDb } = require("../config/database");

const profileRouter = express.Router();


profileRouter.get("/profile", userAuth , async(req,res)=>{
    try{
        const userData = req.user;
        res.render("profile", { user: userData });
    }
    catch(err){
        res.status(400).send("Error" + err);    
    }
})

module.exports = profileRouter;