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
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log("✅ Folder uploads berhasil dibuat!");
}

// ================== MIDDLEWARE (CORS FIX FINAL) ==================
const allowedOrigins = [
  "http://localhost:5173", 
  "http://localhost:3000",
  "https://my-react-project-ruddy-one.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // 1. Izinkan jika origin ada di daftar
    // 2. Izinkan jika TIDAK ADA origin (seperti aplikasi mobile atau Postman)
    // 3. Izinkan domain Vercel manapun (untuk preview branch)
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      console.log("❌ Origin Ditolak:", origin); // Ini biar kamu tahu domain mana yang bikin error
      callback(new Error("Ditolak CORS!"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ================== ROUTES ==================
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");

app.use("/api/auth", authRoutes);
app.use('/api/products', productRoutes);
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

// Middleware untuk menangkap error Multer agar log-nya lebih jelas
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: `Field tidak dikenal: ${error.field}. Pastikan nama field sesuai (image/gallery).`
      });
    }
  }
  next(error);
});