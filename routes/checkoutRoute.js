const express = require('express');
const router = express.Router();
const cartController = require("../controllers/cartController");
const placeOrderController = require("../controllers/placeOrderController");
const verifyToken = require('../utils/verifyToken');

router.post("/add-to-cart",verifyToken,cartController.addToCart);
router.get("/cart/:userId",verifyToken,cartController.retriveFromCart);
router.put("/cart/update-quantity",verifyToken,cartController.updateProductQuantity);
router.delete("/cart/remove-product",verifyToken,cartController.deleteProductFromCart);
router.post("/place-order",verifyToken,placeOrderController.placeOrder);
router.get("/my-orders",verifyToken,placeOrderController.myOrders);

module.exports = router 