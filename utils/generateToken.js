const jwt=require("jsonwebtoken");
const dotenv=require("dotenv");
dotenv.config();

const options = {
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
    sameSite: 'None', // Allow cross-site
    secure: process.env.NODE_ENV === 'production', // secure flag true in production
    path: '/', // Path scope
  };


const generateToken=(res,userId)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:'30d',
    })

    res.cookie('token',token,options)
}

module.exports=generateToken;