const express = require('express');
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const cartController = require("../controllers/cartController");
const verifyToken = require('../utils/verifyToken');

router.get("/todos",categoryController.allCategories);
router.post("/todos",verifyToken,categoryController.postCategories);
router.put('/todos/:id',verifyToken,categoryController.editCategories); 
router.delete('/todos/:id',verifyToken,categoryController.deleteCategories); 

router.post("/add-to-cart",cartController.addToCart);
router.get("/cart/:userId",cartController.retriveFromCart);
router.put("/cart/update-quantity",cartController.updateProductQuantity);
router.delete("/cart/remove-product",cartController.deleteProductFromCart);

module.exports = router