const jwt=require("jsonwebtoken");
const dotenv=require("dotenv");
dotenv.config();

// Update the generateToken function
const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    // Determine if secure cookies should be used
    const secure = process.env.NODE_ENV === 'production';

   
    const cookieOptions = {
        maxAge: 1000 * 60 * 60 * 24 * 30, 
        httpOnly: true,
        path: '/',
    };
    res.cookie('token', token, cookieOptions);
};


module.exports=generateToken;