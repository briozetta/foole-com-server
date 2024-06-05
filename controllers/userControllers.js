const isAdmin = require("../middleware/isAdmin");
const addressSchema = require("../models/address.model");
const User = require("../models/user.model");


exports.updateProfile = async (req, res) => {
    const { firstName, lastName, mobileNo, mobileNo2, state,
        district, pincode, houseNo, locality, nearbyLandmark } = req.body;

    if (req.user.userId !== req.params.id)
        return res.status(401).json({ error: "Invalid token" });

    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id,
            {
                $set: {
                    firstName: firstName,
                    lastName: lastName,
                    'address.mobileNo': mobileNo,
                    'address.mobileNo2': mobileNo2,
                    'address.state': state,
                    'address.district': district,
                    'address.pincode': pincode,
                    'address.houseNo': houseNo,
                    'address.locality': locality,
                    'address.nearbyLandmark': nearbyLandmark
                }
            },
            { new: true }
        );

        res.status(200).json(updateUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        await isAdmin(req, res);
        const allUsers = await User.find(); 
        res.status(200).json(allUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.updateUserRole = async (req, res) => {

    const { id } = req.params;
    const { role } = req.body; 

    try {
        await isAdmin(req, res); 

        const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.getAgentRoleByUserId = async (req, res) => {
    try {
      const userId = req.params.id;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user role:', error);
      res.status(500).json({ error: 'Error fetching user role' });
    }
  }
  
  exports.getUserAddress = async (req, res) => {
    try {
        const { UserId } = req.query;

        // Input validation
        if (!UserId) {
            return res.status(400).json({ error: 'UserId is required in the request query' });
        }

        // Fetch user profile from the database
        const userProfile = await User.findById(UserId);

        if (!userProfile) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Extract addresses from the user profile
        let addresses = [];
        let addressSecond = [];

        if (Array.isArray(userProfile.address)) {
            addresses = userProfile.address.map(address => ({
                mobileNo:address.mobileNo,
                mobileNo2:address.mobileNo2,
                houseNo: address.houseNo,
                locality: address.locality,
                state: address.state,
                district: address.district,
                pincode: address.pincode,
                nearbyLandmark: address.nearbyLandmark
            }));
        }

        if (Array.isArray(userProfile.addressSecond)) {
            addressSecond = userProfile.addressSecond.map(address => ({
                newUserfirstName:address.firstName,
                newUserlastName:address.lastName,
                mobileNo:address.mobileNo,
                mobileNo2:address.mobileNo2,
                houseNo: address.houseNo,
                locality: address.locality,
                state: address.state,
                district: address.district,
                pincode: address.pincode,
                nearbyLandmark: address.nearbyLandmark
            }));
        }

        // Combine addresses
        const combinedAddresses = [...addresses, ...addressSecond];

        // Construct response object
        const response = {
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            email: userProfile.email,
            addresses: combinedAddresses
        };
console.log(response);
        // Send response
        res.json(response);
    } catch (error) {
        console.error('Error fetching user addresses:', error);
        res.status(500).json({ error: 'An unexpected error occurred while fetching user addresses' });
    }
};

exports.addAddress = async (req, res) => {
    try {
      // Extract address data from request body
      const {firstName,lastName, mobileNo, mobileNo2, state, district, pincode, houseNo, locality, nearbyLandmark } = req.body.address;
  const {userId} = req.body

  if (!firstName || !lastName || !mobileNo || !state || !district || !pincode || !houseNo || !locality || !nearbyLandmark) {
    return res.status(400).json({ error: 'Missing required address fields' });
  }
     // Create a new address object
      const newAddress = {
        firstName,lastName,
        mobileNo,
        mobileNo2,
        state, 
        district,
        pincode,
        houseNo,
        locality,
        nearbyLandmark
      };
  
  
      // Find the user by ID 
      const userData = await User.findById(userId);
      console.log(userId);
      if (!userData) {  
        return res.status(404).json({ error: 'User not found' });
      }
  
   
      userData.addressSecond.push(newAddress);
  
      // Save the user data
      await userData.save();
   
      // Respond with success message and new address data
      res.status(201).json({ message: 'Address added successfully', address: newAddress });
    } catch (err) {
      console.error('Error adding address:', err.message);
      // Respond with error message
      res.status(500).json({ error: 'Internal server error' });         
    }
  };