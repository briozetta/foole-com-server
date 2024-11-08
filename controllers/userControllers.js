const isAdmin = require("../middleware/isAdmin");
const User = require("../models/user.model");
const bcrypt = require('bcrypt');

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
    const verifiedUsers = await User.find({ verified: true });
    res.status(200).json(verifiedUsers);
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

    // Initialize address arrays
    let addresses = [];
    let addressSecond = [];

    // Extract primary address if it exists
    if (userProfile.address && typeof userProfile.address === 'object') {
      const {
        mobileNo,
        mobileNo2,
        houseNo,
        locality,
        state,
        district,
        pincode,
        nearbyLandmark
      } = userProfile.address;

      addresses.push({
        mobileNo: mobileNo,
        mobileNo2: mobileNo2,
        houseNo: houseNo,
        locality: locality,
        state: state,
        district: district,
        pincode: pincode,
        nearbyLandmark: nearbyLandmark
      });
    }

    // Extract secondary addresses if they exist
    if (Array.isArray(userProfile.addressSecond)) {
      addressSecond = userProfile.addressSecond.map(address => ({
        _id: address._id,
        newUserfirstName: address.firstName,
        newUserlastName: address.lastName,
        mobileNo: address.mobileNo,
        mobileNo2: address.mobileNo2,
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
    const { firstName, lastName, mobileNo, mobileNo2, state, district, pincode, houseNo, locality, nearbyLandmark } = req.body.address;
    const { userId } = req.body

    if (!firstName || !lastName || !mobileNo || !state || !district || !pincode || !houseNo || !locality || !nearbyLandmark) {
      return res.status(400).json({ error: 'Missing required address fields' });
    }
    // Create a new address object
    const newAddress = {
      firstName, lastName,
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

exports.deleteUserAddress = async (req, res) => {
  try {
    const { _id } = req.query;  // This should be the user ID
    const addressId = req.params.id;  // This is the address ID to delete

    const userData = await User.findById(_id);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Use the $pull operator to remove the address from the addressSecond array
    await User.findByIdAndUpdate(
      _id,
      { $pull: { addressSecond: { _id: addressId } } },
      { new: true }
    );

    return res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.addUserByAgent = async (req, res) => {
  try {
    const { agentId, formData } = req.body;
    const { contact, firstName, lastName, password } = formData;
   
    // Patterns for phone and email validation
    const phonePattern = /^\d{10}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isPhone = phonePattern.test(contact);
    const isEmail = emailPattern.test(contact);

    // Validate the contact information
    if (!isPhone && !isEmail) {
      return res.status(400).json({ message: 'Please enter a valid 10-digit phone number or email address.' });
    }

    // Check if user already exists
    let existingUser;
    if (isPhone) {
      existingUser = await User.findOne({ phone: contact });
    } else if (isEmail) {
      existingUser = await User.findOne({ email: contact });
    }

    if (existingUser) {
      return res.status(400).json({ message: 'User with this contact already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user data object
    const userData = {
      firstName,
      lastName,
      password: hashedPassword,
      agentId,
      verified: true,
    };

    // Assign the contact information appropriately
    if (isPhone) {
      userData.phone = contact;
    } else if (isEmail) {
      userData.email = contact;
    }

    // Create and save the new user
    const newUser = new User(userData);
    await newUser.save();

    res.status(201).json({ message: 'User added successfully', user: newUser });
  } catch (error) {
    console.error('Error adding user by agent:', error);
    res.status(500).json({ message: 'An error occurred. Please try again.' });
  }
};