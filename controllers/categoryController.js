const isAdmin = require("../middleware/isAdmin");
const Category = require("../models/categories.modal");

exports.allCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

exports.postCategories = async (req, res) => {
  try {
    await isAdmin(req, res);

    const base64Image = req.body.image;
    
    // Check if the base64 image is larger than 100KB
    const base64ImageSize = Buffer.byteLength(base64Image, 'base64');
    const sizeLimit = 100 * 1024; // 100KB

    if (base64ImageSize > sizeLimit) {
      return res.status(400).json({ message: "Image size exceeds 100KB limit" });
    }

    const newCategory = new Category({ 
      categories: req.body.categories,
      image: base64Image // Already in base64 format
    });

    const savedCategory = await newCategory.save();
    res.json(savedCategory);
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.editCategories = async (req, res) => {
  try {
    await isAdmin(req, res);

    const base64Image = req.body.image;
    
    // Check if the base64 image is larger than 100KB
    const base64ImageSize = Buffer.byteLength(base64Image, 'base64');
    const sizeLimit = 100 * 1024; // 100KB

    if (base64ImageSize > sizeLimit) {
      return res.status(400).json({ message: "Image size exceeds 100KB limit" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { 
        categories: req.body.categories,
        image: base64Image // Already in base64 format
      },
      { new: true } 
    );

    res.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.deleteCategories = async (req, res) => {
  try {
    await isAdmin(req, res); 
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Server Error" });
  }
}