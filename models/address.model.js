const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    mobileNo: { type: String },
    mobileNo2: { type: String },
    state: { type: String },
    district: { type: String }, 
    pincode: { type: String },
    houseNo: { type: String },
    locality: { type: String },
    nearbyLandmark: { type: String }
});

module.exports = addressSchema; 
