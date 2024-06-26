const isAdmin = require("../middleware/isAdmin");
const Orders = require("../models/orders.model");

exports.getAllorders = async (req, res) => {
    try {
        await isAdmin(req, res);
        const allOrders = await Orders.find();
        res.status(200).json(allOrders); 
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }  
}

exports.updateOrder = async (req, res) => {
    try {
        const { _id } = req.body;
        const order = await Orders.findById(_id);
    
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        } 
    
        order.isShipped = !order.isShipped; // Toggle the isShipped property
        order.status = order.isShipped ? 'Shipped' : 'Unshipped'; // Update the status
    
        await order.save(); // Save the updated order
    
        res.status(200).json({ message: 'Order updated successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
