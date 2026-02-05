const Order = require("../models/Order");
const Product = require("../models/Product");

// ===============================
// CREATE ORDER
// ===============================
exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    // validasi basic
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items is empty",
      });
    }

    let orderItems = [];
    let totalPrice = 0;

    for (const item of items) {
      // validasi quantity
      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid item quantity",
        });
      }

      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      const itemTotal = product.price * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price, // snapshot harga
      });

      totalPrice += itemTotal;
    }

    const order = await Order.create({
      items: orderItems,
      totalPrice,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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
