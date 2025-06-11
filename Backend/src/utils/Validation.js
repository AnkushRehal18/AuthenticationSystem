const validator = require("validator");
const passwordValidator = require('password-validator');

const schema = new passwordValidator();

schema
.is().min(8)                                    // Minimum length 8
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits

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