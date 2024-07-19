const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String },
    description: { type: String },
    category: { type: String },
    size: [{ type: String }],   
    price: { type: Number },
    agentCommission: { type: Number },
    displayDiscount: { type: Number },
    images: [{ type: String }],
    inventory: { type: Number },
    availability:  { type: String, enum: ['In stock', 'Out of stock', ]},
    disabled:{type:Boolean}
});

const Products = mongoose.model('Product', productSchema);

module.exports = Products;
