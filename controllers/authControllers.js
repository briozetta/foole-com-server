const User = require("../models/user.model");
const bcrypt = require('bcrypt');
const dotenv=require("dotenv");
const sendMail = require("../utils/sendMail");
const crypto = require('crypto');
const generateToken = require("../utils/generateToken");
dotenv.config();

exports.getAll = async = (req, res) => {
  try {
    res.send("hello Welcome")
  } catch (error) {
    res.json("Not Found!!")
  }
}
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

// signup
exports.signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(404).json({ error: 'Email already exists' }); 
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = Date.now() + 300000;

    const newUser = await User.create({ firstName, lastName, email, password: hashedPassword,otp,otpExpires });

    generateToken(res, newUser._id);
    let purpose = "verification"
    sendMail(otp,newUser.email,purpose);
    res.json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

// sign in
exports.signin = async (req, res, next) => {
  const { identifier, password } = req.body;
  try {
    let validUser;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const phonePattern = /^[0-9]{10}$/;

    if (emailPattern.test(identifier)) {
      validUser = await User.findOne({ email: identifier });
    } else if (phonePattern.test(identifier)) {
      validUser = await User.findOne({ phone: identifier });
    } else {
      return res.status(400).json({ message: 'Invalid email or phone number format' });
    }

    if (!validUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!validUser.verified) {
      return res.status(400).json({ message: 'Please verify your email. check your E-mail for verification link.' });
    }

    // check verified is true 
    const validatePassword = bcrypt.compareSync(password, validUser.password);
    if (!validatePassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    generateToken(res, validUser._id);


    const { password: hashedPassword, ...rest } = validUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// E-maii verification

exports.mailVerification = async (req, res) => {
  try {
    const { otp, email,purpose } = req.body;
    
    const user = await User.findOne({email});
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    };

    if (!user.otp || user.otpExpires < Date.now()) { 
      return res.status(400).json({ message: 'OTP expired or invalid' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (purpose === 'verifySignup') {
      if (user.verified) {
        return res.status(400).json({ message: 'User already verified' });
      }
      user.verified = true;
      user.otp = undefined;
      user.otpExpires = undefined;
    }

    await user.save();

    res.status(200).json({ message: `${purpose === 'verifySignup' ? 'User verified successfully' : 'OTP verified successfully, proceed to reset your password'}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



exports.resendOtp = async (req,res) =>{
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const otpExpires = Date.now() + 300000; // OTP valid for 5 minutes (300000 ms)

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const purpose = "reset_password";
    await sendMail(otp, user.email, purpose);
    res.json({ message: 'OTP resent successfully' });

  } catch (error) {
     
  }
}

exports.resetPassword = async (req, res) => {
  const { password,email,otp } = req.body; 
  try {
    const user = await User.findOne({
      email
    }); 
  
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

// logout
exports.logout = async (req, res) => {
  try {
    await res.clearCookie('token').status(200).json('Signout success!');
  } catch (error) {
    console.error('Error occurred during logout:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}