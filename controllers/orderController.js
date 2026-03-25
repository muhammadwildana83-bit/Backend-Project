const Order = require("../models/Order");
const Product = require("../models/Product");

// ===============================
// CREATE ORDER
// ===============================
exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body; // Kita hanya ambil items, totalPrice dihitung ulang di sini (lebih aman)

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Keranjang kosong" });
    }

    let orderItems = [];
    let calculatedTotal = 0;

    for (const item of items) {
      console.log("Item yang diterima:", item);
      // 1. Cek apakah productId ada di payload
      if (!item.productId) {
        return res.status(400).json({ success: false, message: "ID Produk tidak ditemukan di payload" });
      }

      // 2. Cari produk di database
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Produk dengan ID ${item.productId} tidak ditemukan` });
      }

      // 3. Masukkan ke array sesuai Schema Model (menggunakan field 'product')
      orderItems.push({
        product: product._id, // Merujuk ke field 'product' di Model Order
        quantity: Number(item.quantity),
        price: product.price, 
      });

      calculatedTotal += product.price * Number(item.quantity);
    }

    // 4. Simpan ke database
    const order = await Order.create({
      items: orderItems,
      totalPrice: calculatedTotal,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });

  // Di Backend (Order Controller)
} catch (error) {
  console.log("FULL ERROR DB:", error); // Lihat ini di LOG RAILWAY
  res.status(500).json({
    success: false,
    message: error.message,
    stack: error.stack // Tambahkan ini buat debug sementara
  });
}
};

// ===============================
// GET ALL ORDERS
// ===============================
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product");

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET ORDER BY ID
// ===============================
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
