// Import library mongoose untuk membuat schema dan model MongoDB
const mongoose = require("mongoose");

// Membuat schema Order
const orderSchema = new mongoose.Schema(
  {
    // Array of items (nested structure)
    items: [
      {
        // Referensi ke produk yang dipesan
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        // Jumlah produk yang dipesan
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        // Harga per produk
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    // Total harga seluruh pesanan
    totalPrice: {
      type: Number,
      required: true,
    },

    // Status pesanan
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  // Opsi untuk menambahkan createdAt dan updatedAt otomatis
  { timestamps: true }
);

// Ekspor model Order agar bisa digunakan di file lain
module.exports = mongoose.model("Order", orderSchema);
