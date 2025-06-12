const validator = require("validator");
const passwordValidator = require('password-validator');

const schema = new passwordValidator();

schema
.is().min(8)                          
.has().uppercase()                              
.has().lowercase()                            
.has().digits(2)                               

const ValidateSignupData = (req)=>{
    const {username, email, password} = req.body;

    if(!username){
        throw new Error("Username is required")
    }
    else if(!validator.isEmail(email)){
        throw new Error("Email is not valid")
    }
    else if(!schema.validate(password)){
        throw new Error("Password is not Valid")
    }
}

module.exports = ValidateSignupData