const Cart = require("../models/cart.model");
const Orders = require("../models/orders.model");
const sendMail = require("../utils/sendMail");


exports.placeOrder = async (req, res) => {
    try {
        const { orderDetails } = req.body;
        const {
            userId,
            items,
            shippingMethod,
            totalAmount,
            shippingAddress
        } = orderDetails;

        console.log(shippingAddress);
        // Validate required fields
        if (!userId || !items || !shippingMethod || !totalAmount || !shippingAddress) {
            return res.status(400).json({ error: "Missing required fields" });
        } 

        // Create a new order object
        const newOrder = new Orders({
            userId,
            items,
            shippingMethod,
            shippingAddress,
            totalAmount
        });

        // Save the order to the database
        await newOrder.save();
        await Cart.findOneAndDelete({ userId });

        // Respond with the newly created order
        res.status(201).json("Order placed successfully");

        // Send confirmation email if email is provided
        if (shippingAddress.email) {
            const purpose = "order_confirmation";
            sendMail(userId, shippingAddress.email, purpose, items, totalAmount);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.myOrders = async (req, res) => {
    try {
        const { userId } = req.query;
        const myOrders = await Orders.find({ userId });

        if (myOrders.length === 0) {
            return res.status(404).json({ message: 'Orders not found' });
        }

        const ordersToSend = myOrders.map(order => ({
            items: order.items,
            shippingMethod: order.shippingMethod,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt.toISOString().slice(0, 19).replace('T', ' ') // Format createdAt as needed
        }));

        res.json(ordersToSend);
        
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
}