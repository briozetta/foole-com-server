const express = require('express');
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const verifyToken = require('../utils/verifyToken');

router.get("/todos",categoryController.allCategories);
router.post("/todos",verifyToken,categoryController.postCategories);
router.put('/todos/:id',verifyToken,categoryController.editCategories); 
router.delete('/todos/:id',verifyToken,categoryController.deleteCategories); 

module.exports = router