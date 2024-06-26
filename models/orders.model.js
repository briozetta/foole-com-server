const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    productName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    images: [{
        type: String,
        required: true,
    }],
    quantity: {
        type: Number,
        required: true,
    },
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    isShipped:{type:Boolean,default:false},
    shippingMethod: {
        type: String,
        required: true,
    },
    shippingMethod: {
        type: String,
        required: true,
    },
    shippingAddress: {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
            
        },
        newUserfirstName: {
            type: String,
            
        },
        newUserlastName: {
            type: String,
            
        },
        email: {
            type: String,
            required: false,
        },
        state: {
            type: String,
            required: true,
        },
        mobileNo: {
            type: String,
            required: true,
        },
        mobileNo2: {
            type: String,
        },
        houseNo: {
            type: String,
            required: true,
        },
        locality: {
            type: String,
            required: true,
        },
        district: {
            type: String,
            required: true,
        },
        pincode: {
            type: String,
            required: true,
        },
        nearbyLandmark: {
            type: String,
        }
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Orders = mongoose.model('Order', OrderSchema);

module.exports = Orders;
