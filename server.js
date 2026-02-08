const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");

dotenv.config();

const app = express();

// ================== MIDDLEWARE ==================
app.use(cors());
app.use(express.json());

// ================== DATABASE ==================
connectDB();

// ================== STATIC FILES ==================
// supaya gambar bisa diakses dari browser
// http://localhost:5000/uploads/namafile.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================== ROUTES ==================
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// ================== TEST ==================
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// ================== SERVER ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ================== TEST ORDER ==================
app.post("/test-order", (req, res) => {
  res.json({
    success: true,
    body: req.body,
  });
});
 
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan!" });
});