const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

// ===============================
// CREATE PRODUCT
// ===============================
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required",
      });
    }

    // 1. Ambil Foto Utama (image)
    // Karena pakai upload.fields, aksesnya lewat req.files['namaField']
    const mainImage = req.files && req.files['image'] ? req.files['image'][0] : null;
    const imagePath = mainImage ? `uploads/${mainImage.filename}` : "";

    // 2. Ambil Gallery (gallery) - Jika ada
    const galleryFiles = req.files && req.files['gallery'] ? req.files['gallery'] : [];
    const galleryPaths = galleryFiles.map(file => `uploads/${file.filename}`);

    const product = await Product.create({
      name,
      price,
      description,
      image: imagePath,
      gallery: galleryPaths, // Pastikan di Model Product.js ada field gallery: [String]
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error Create Product:", error); // Biar kelihatan di terminal
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ===============================
// GET ALL PRODUCTS
// ===============================
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET PRODUCT BY ID
// ===============================
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 1. Biarkan imagePath pakai yang lama dulu (default)
    let imagePath = product.image;

    // 2. Cek apakah ada file baru yang diupload
    // Karena di create kamu pakai req.files['image'], 
    // pastikan di route update juga pakai upload.fields atau upload.single
    
    // Jika menggunakan upload.single('image'):
    if (req.file) {
      // Hapus gambar lama jika ada
      if (product.image) {
        const oldPath = path.join(__dirname, "..", product.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      // Set path baru
      imagePath = `uploads/${req.file.filename}`;
    } 
    // Jika menggunakan upload.fields (seperti di create):
    else if (req.files && req.files['image']) {
       if (product.image) {
        const oldPath = path.join(__dirname, "..", product.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      imagePath = `uploads/${req.files['image'][0].filename}`;
    }

    // 3. Update data field
    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.description = description ?? product.description;
    product.image = imagePath;

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error Update Backend:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// DELETE PRODUCT
// ===============================
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // hapus file gambar
    if (product.image) {
      const filePath = path.join(__dirname, "..", product.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
