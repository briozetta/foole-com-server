const isAdmin = require("../middleware/isAdmin");
const Category = require("../models/categories.modal");
const CardAdjuster = require("../models/CardAdjuster.mode");

exports.allCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
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

// Home card adjusters
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

exports.updateCards = async (req, res) => {
  const { category1, category2, startingPrice, endingPrice } = req.body;

  if (startingPrice >= endingPrice) {
    return res.status(400).json({ message: 'Ending price must be greater than starting price.' });
  }

  try {
    if (req.user.userId !== req.params.id) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    let updatedCard = await CardAdjuster.findById(req.params.id);

    if (!updatedCard) {
      updatedCard = new CardAdjuster({
        _id: req.params.id,
        category1,
        category2,
        startingPrice,
        endingPrice,
        userId: req.user.userId
      });
      await updatedCard.save();
    } else {
      updatedCard.category1 = category1;
      updatedCard.category2 = category2;
      updatedCard.startingPrice = startingPrice;
      updatedCard.endingPrice = endingPrice;
      await updatedCard.save();
    }

    res.status(200).json(updatedCard);
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ message: 'Error updating data' });
  }
};

exports.getCardDetails = async (req, res) => {
  try {
    const card = await CardAdjuster.findOne();

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.status(200).json(card);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error fetching data' });
  }
};




