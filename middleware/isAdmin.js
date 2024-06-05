const User = require('../models/user.model');

const isAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || user.role !== 'Admin') {
      return res.status(403).json({ error: "You can't access data" });
    }
  } catch (error) {
    console.error('Error in isAdmin middleware:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 

module.exports = isAdmin;
