const User = require("../models/user.model");
const Cart = require("../models/cart.model");


exports.addToCart = async (req, res) => {
  try {
    const {
      _id: productId,
      productName,
      description,
      category,
      agentCommission,
      displayDiscount,
      size,
      price,
      images,
      quantity,
    } = req.body.product;

    const userID = req.body.userID;

    // Find the user by userID
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the user's cart
    let cart = await Cart.findOne({ userId: user._id });

    if (!cart) {
      // If no cart exists, create a new one
      cart = new Cart({
        userId: user._id,
        products: [],
        agentId: userID, // Adjust if necessary
      });
    }

    // Check if the product already exists in the cart   
    const existingProductIndex = cart.products.findIndex(p => p.productId === productId);
    if (existingProductIndex !== -1) {
      return res.status(400).json({ message: "This item is already in the cart" });
    } else {
      // Otherwise, add the new product
      cart.products.push({
        productId,
        productName,
        description,
        category,
        price,
        category,
        agentCommission,
        displayDiscount,
        size,
        images,
        quantity,
      });
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.retriveFromCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Find the cart by userId
    const cart = await Cart.findOne({ userId });

    if (!cart || !cart.products.length) {
      return res.json({ message: 'No items found in cart' });
    }
    // Extract the products array
    const products = cart.products;

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching cart data:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateProductQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Find the user's cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the product in the cart
    const productIndex = cart.products.findIndex(p => p.productId === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Update the product quantity
    cart.products[productIndex].quantity = quantity;

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Product quantity updated", cart });
  } catch (error) {
    console.error("Error updating product quantity:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

async function removeProductFromCart(userId, productId) {
  console.log("===productId====::", productId);
  try {
    // First, find the cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      console.log('Cart not found');
      return false;
    }

    // Find the index of the product to remove in the products array 
    let productIndex = -1;
    for (let i = 0; i < cart.products.length; i++) {
      console.log(cart.products[i].productId);
      if (cart.products[i].productId === productId) {
        productIndex = i;
        break;
      }
    }

    if (productIndex === -1) {
      console.log('Product not found in cart');
      return false;
    }

    // Remove the product from the cart
    cart.products.splice(productIndex, 1);

    // Update the cart in the database
    await cart.save();

    console.log('Product removed successfully');
    return true;
  } catch (err) {
    console.error('Error removing product from cart:', err);
    return false;
  }
}

exports.deleteProductFromCart = async (req, res) => {
  const { userId, productId } = req.body;

  const success = await removeProductFromCart(userId, productId);

  if (success) {
    res.status(200).json({ message: 'Product removed successfully' });
  } else {
    res.status(400).json({ message: 'Failed to remove product from cart' });
  }
};