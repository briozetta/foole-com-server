const express = require('express');
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const verifyToken = require('../utils/verifyToken');

router.get("/todos",categoryController.allCategories);
router.post("/todos",verifyToken,categoryController.postCategories);
router.put('/todos/:id',verifyToken,categoryController.editCategories); 
router.delete('/todos/:id',verifyToken,categoryController.deleteCategories); 

router.put("/update-special-card/:id",verifyToken,categoryController.updateCards);
router.get("/get-card-details",categoryController.getCardDetails);

module.exports = router