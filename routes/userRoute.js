const express = require('express');
const router = express.Router();
const authController = require("../controllers/authControllers");
const userController = require("../controllers/userControllers");
const agentUserControllers = require("../controllers/agentUserControllers");
const adminUserControllers = require("../controllers/adminUserControllers");
const verifyToken = require('../utils/verifyToken');

// auth routes
router.get('/',authController.getAll);
router.post('/sign-up',authController.signup); 
router.post('/sign-in',authController.signin);
router.post('/verify-email',authController.mailVerification);
router.get('/logout',authController.logout);
router.get('/check-permission',authController.protectedRoute);
router.get("/get-all-users",verifyToken,userController.getAllUsers);
router.get("/agent/:id",verifyToken,userController.getAgentRoleByUserId); 
router.post('/resend-otp',authController.resendOtp);
router.post('/reset-password', authController.resetPassword);
// user routes
router.put('/update-profile/:id',verifyToken,userController.updateProfile); 
router.put('/update-role/:id',verifyToken,userController.updateUserRole); 
router.get('/user-address',verifyToken,userController.getUserAddress); 
router.post('/add-address',verifyToken,userController.addAddress); 
router.delete('/delete-address/:id',verifyToken,userController.deleteUserAddress); 
router.post('/add-user',verifyToken,userController.addUserByAgent);

// agent routes
router.get('/agent-user',verifyToken, agentUserControllers.getAllUsersByAgentId)

// admin routes
router.get('/get-all-orders',verifyToken, adminUserControllers.getAllorders);
router.get('/get-agent',verifyToken, adminUserControllers.getAgentById);
router.put('/update-order', verifyToken,adminUserControllers.updateOrder);  

module.exports = router