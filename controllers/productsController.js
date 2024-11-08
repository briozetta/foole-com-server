const dotenv = require("dotenv");
const isAdmin = require('../middleware/isAdmin');
const Products = require('../models/products.mode');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs').promises;
dotenv.config();


async function uploadToDigitalOcean(path, originalFilename, mimetype) {
  const client = new S3Client({ 
    region: 'us-east-1', // This can be any valid AWS region
    endpoint: 'https://nyc3.digitaloceanspaces.com', // DigitalOcean Space endpoint for NYC3 region
    credentials: {
      accessKeyId: process.env.ACCESS_KEY, // DigitalOcean Spaces Access Key
      secretAccessKey: process.env.SECRET_ACCESS_KEY, // DigitalOcean Spaces Secret Key
    },
  });

  const parts = originalFilename.split('.');
  const ext = parts[parts.length - 1];
  const newFilename = Date.now() + '.' + ext;
  const bucket = 'gaadi9loofee'; // Replace with your DigitalOcean Space name
  const folder = 'loofee-storage'; // Folder inside storage space

  try {
    const fileContent = await fs.readFile(path); // Read file asynchronously

    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Body: fileContent,
      Key: `${folder}/${newFilename}`,
      ContentType: mimetype,
      ACL: 'public-read', // Optional: Change or remove based on your needs
    }));
    return `https://${bucket}.nyc3.cdn.digitaloceanspaces.com/${folder}/${newFilename}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

exports.uploadImage = async (req, res) => {
  try {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
      const { path: filePath, originalname, mimetype } = req.files[i];
      const url = await uploadToDigitalOcean(filePath, originalname, mimetype);
      uploadedFiles.push(url);
    }
    res.status(200).json(uploadedFiles);
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.addProducts = async (req, res) => {
  try {
    await isAdmin(req, res);
    const requiredFields = ['productName', 'description', 'category', 'price', 'inventory', 'availability', 'agentCommission',];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    if (!req.body.images || req.body.images.length === 0) {
      return res.status(400).json({ error: 'images are empty' });
    }

    const newProducts = {
      productName: req.body.productName,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      images: req.body.images,
      inventory: req.body.inventory,
      availability: req.body.availability,
      agentCommission: req.body.agentCommission,
      displayDiscount: req.body.displayDiscount,
      size: req.body.size

    }
    await Products.create(newProducts);
    res.status(200).json({ message: "Product added successfully" })
  } catch {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }

} 

exports.getProducts = async (req, res) => {

  try {
    const products = await Products.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
}

exports.getAllProducts = async (req, res) => {

  try {
    res.json(res.paginatedResult);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
}
exports.getProductsById = async (req, res) => {
  try {

    const product = await Products.findById(req.params.id);
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Error fetching product" });
  }
}


exports.updateProductsById = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, description, category, price, images, inventory,
      availability, size, agentCommission, displayDiscount } = req.body;
    const requiredFields = ['productName', 'description', 'category', 'price', 'inventory', 'availability'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }
    if (!req.body.images || req.body.images.length === 0) {
      return res.status(400).json({ error: 'images are empty' });
    }

    const updatedProduct = await Products.findByIdAndUpdate(id, {
      productName,
      description,
      category,
      price,
      images,
      inventory,
      availability,
      size,
      agentCommission,
      displayDiscount


    }, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.disableProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const Product = await Products.findByIdAndUpdate(id, { disabled: true }, { new: true });
    if (!Product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.relatedProducts = async (req, res) => {
  try {
    const category = req.query.category;
    const excludeId = req.query._id;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const products = await Products.find({ 
      category, 
      _id: { $ne: excludeId } 
    }).limit(4);

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};