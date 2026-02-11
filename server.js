const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const fs = require('fs');
const path = require("path");

const connectDB = require("./config/db");

dotenv.config();

const app = express();
const dir = './uploads';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    console.log("✅ Folder uploads berhasil dibuat otomatis!");}

// ================== MIDDLEWARE ==================
// Hapus yang lama, ganti jadi ini:
app.use(cors()); // Ini akan mengizinkan SEMUA secara default

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  // Tangani Preflight (OPTIONS) secara manual biar nggak kena blokir
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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