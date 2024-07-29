const isAgent = require("../middleware/isAgent");
const User = require("../models/user.model");
const Orders = require("../models/orders.model");

exports.getAllUsersByAgentId = async (req, res) => {
    try {
        const { agentId } = req.query; 
        await isAgent(req, res);

        if (!agentId) {
            return res.status(400).json({ error: "agentId is required" });
        }

        // Find users by agentId, excluding the password field
        const agentUsers = await User.find({ agentId }).select('-password');

        if (!agentUsers.length) {
            return res.status(404).json({ message: "No users found for this agent" }); 
        }

        // Prepare the response structure
        const usersWithOrders = await Promise.all(agentUsers.map(async (user) => {
            const orders = await Orders.find({ userId: user._id });
            let totalCommission = 0;

            const ordersWithCommission = orders.map(order => {
                // Calculate the commission for each order
                const orderCommission = order.items.reduce((acc, item) => {
                    // Convert agentCommission from whole number to decimal
                    const agentCommissionDecimal = item.agentCommission / 100;
                    const commission = Math.ceil(agentCommissionDecimal * item.price * item.quantity);
                    return acc + commission;
                }, 0);

                totalCommission += orderCommission;

                return {
                    ...order._doc, // Spread the original order document
                    commission: orderCommission
                }; 
            });

            return { 
                user, 
                orders: ordersWithCommission,
                totalCommission
            };
        }));

        res.status(200).json(usersWithOrders); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" }); 
    }
};


