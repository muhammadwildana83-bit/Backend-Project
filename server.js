const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const fs = require('fs');
const path = require("path");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

// ================== KONEKSI DATABASE ==================
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Terhubung: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ KONEKSI DB GAGAL: ${error.message}`);
  } 
};

// WAJIB DIPANGGIL BIAR KONEK!
connectDB();

// Buat folder uploads
const dir = './uploads';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    console.log("✅ Folder uploads berhasil dibuat!");
}

// ================== MIDDLEWARE (CORS FIX) ==================
const allowedOrigins = [
  "http://localhost:5173", 
  "https://my-react-project-ruddy-one.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Ditolak CORS!"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================== ROUTES ==================
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// ================== TEST & OTHERS ==================
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.post("/test-order", (req, res) => {
  res.json({ success: true, body: req.body });
});

app.use((req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan!" });
});

// ================== SERVER ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});