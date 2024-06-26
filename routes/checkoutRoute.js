const express = require('express');
const router = express.Router();
const cartController = require("../controllers/cartController");
const placeOrderController = require("../controllers/placeOrderController");

router.post("/add-to-cart",cartController.addToCart);
router.get("/cart/:userId",cartController.retriveFromCart);
router.put("/cart/update-quantity",cartController.updateProductQuantity);
router.delete("/cart/remove-product",cartController.deleteProductFromCart);
router.post("/place-order",placeOrderController.placeOrder);
router.get("/my-orders",placeOrderController.myOrders);

module.exports = router