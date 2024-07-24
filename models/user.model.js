const mongoose = require('mongoose');
const addressSchema = require('./address.model');
const addressSchemaSecond = require('./address2.model');

const userSchema = new mongoose.Schema({
  userID: { type: String, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String,},
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  password: { type: String,sparse: true},
  otp: {
    type: String,     
  },
  otpExpires: {
    type: Date, 
    required: false
  },
  verified:{type:Boolean,default:false},
  role: { type: String, enum: ['Customer', 'Admin', 'Agent'], default: 'Customer' },
  agentId:{type:String},
  address: addressSchema, 
  addressSecond:[addressSchemaSecond],  
  country: { type: String },
  deviceId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: String, default: 'admin' },
  updatedBy: { type: String, default: 'admin' },
  isActive: { type: Boolean, default: true }

},{collection: "userData" });

const User = mongoose.model('User', userSchema); 

module.exports = User;