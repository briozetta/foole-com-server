const User = require("../models/user.model");
const bcrypt = require('bcrypt');
const dotenv=require("dotenv");
const sendMail = require("../utils/sendMail");
const nodemailer = require("nodemailer");
const crypto = require('crypto');
const jwt=require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
dotenv.config();

exports.getAll = async = (req, res) => {
  try {
    res.send("hello Welcome")
  } catch (error) {
    res.json("Not Found!!")
  }
}

// signup
exports.signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(404).json({ error: 'Email already exists' }); 
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ firstName, lastName, email, password: hashedPassword });

    let purpose = "verification"
    sendMail(newUser._id,newUser.email,purpose);
    res.json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

// sign in
exports.signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
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
    const { _id } = req.body;
    const validUser = await User.findOne({ _id, verified: true });
    if (validUser) {
      return res.status(404).json({ message: 'User already signed up this link is expired' });
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id },
      { verified: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();
    let purpose = "reset_password"
   await sendMail(token,user.email,purpose);
    res.status(200).json({ message: 'verification link sented to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
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