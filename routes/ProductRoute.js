const express = require('express');
const router = express.Router();
const productsController = require("../controllers/productsController");
const verifyToken = require('../utils/verifyToken');
const Products = require('../models/products.mode');
const paginatedResults = require('../utils/pagination');
const upload = require('../config/multerConfig');

router.post("/upload", upload.array('photos', 100), productsController.uploadImage);       
router.post("/add-product",verifyToken,productsController.addProducts); 
// paginated products
router.get("/all-products",paginatedResults(Products),productsController.getAllProducts); 
router.get("/get-all-products",productsController.getProducts);  
// end
router.get("/products/:id",productsController.getProductsById);  
router.put("/update-product/:id",verifyToken,productsController.updateProductsById); 
router.put("/product-delete/:id",verifyToken,productsController.disableProduct); 
//related products
router.get("/get-related-products",productsController.relatedProducts);

module.exports = router

