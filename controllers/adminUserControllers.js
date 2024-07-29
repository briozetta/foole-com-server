const isAdmin = require("../middleware/isAdmin");
const Orders = require("../models/orders.model");
const User = require("../models/user.model");

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

exports.getAgentById = async (req, res) => {
    try {
      // Ensure the user is an admin
      await isAdmin(req, res);

      const _id = req.query.id;

      const Agent = await User.findById(_id);
      if (!Agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
      const { firstName, lastName, email, phone } = Agent;
      res.status(200).json({ firstName, lastName, email, phone });
    } catch (error) {
      // Log the error and send an error response
      console.error("Error fetching agent data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  