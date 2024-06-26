const express = require('express');
const router = express.Router();
const authController = require("../controllers/authControllers");
const userController = require("../controllers/userControllers");
const agentUserControllers = require("../controllers/agentUserControllers");
const adminUserControllers = require("../controllers/adminUserControllers");
const verifyToken = require('../utils/verifyToken');

// auth routes
router.get('/',authController.getAll);
router.get('/logout',authController.logout);
router.get("/get-all-users",verifyToken,userController.getAllUsers);
router.get("/agent/:id",userController.getAgentRoleByUserId); 
router.post('/sign-up',authController.signup); 
router.post('/sign-in',authController.signin);
router.post('/verify-email',authController.mailVerification);
router.post('/resend-otp',authController.resendOtp);
router.post('/reset-password', authController.resetPassword);
// user routes
router.put('/update-profile/:id',verifyToken,userController.updateProfile); 
router.put('/update-role/:id',verifyToken,userController.updateUserRole); 
router.get('/user-address',userController.getUserAddress); 
router.post('/add-address',userController.addAddress); 
router.delete('/delete-address/:id',userController.deleteUserAddress); 
router.post('/add-user',userController.addUserByAgent);

// agent routes
router.get('/agent-user',verifyToken, agentUserControllers.getAllUsersByAgentId)

// admin routes
router.get('/get-all-orders',verifyToken, adminUserControllers.getAllorders);
router.put('/update-order', adminUserControllers.updateOrder);  

module.exports = router