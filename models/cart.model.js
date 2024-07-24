const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  agentId: { type: String },
  productName: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, 
  price: { type: Number, required: true },
  images: [{ type: String }],
  quantity: { type: Number, default: 1, required: true },
  agentCommission:{type:Number},
  displayDiscount:{ type: String }, 
  size:{ type: String },
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [productSchema],
  TotalPrice:{type:Number}
}, { collection: "cartData", timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart; 
