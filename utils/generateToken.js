const jwt=require("jsonwebtoken");
const dotenv=require("dotenv");
dotenv.config();

// Update the generateToken function
const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { 
        expiresIn: '30d',
    });
    const cookieOptions = {
        maxAge: 1000 * 60 * 60 * 24 * 30, 
        httpOnly: true,
        sameSite: 'Strict', 
        secure: true
    };
    res.cookie('token', token, cookieOptions);
};


module.exports=generateToken;
