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
        const newCategory = new Category({ categories: req.body.categories });
        const savedCategory = await newCategory.save();
        res.json(savedCategory);
      } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ message: "Server Error" });
      }
}
exports.editCategories = async (req, res) => {
    try {
        await isAdmin(req, res);
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id,
        { categories: req.body.categories }, { new: true });
        res.json(updatedCategory);
      } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ message: "Server Error" });
      }
}

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