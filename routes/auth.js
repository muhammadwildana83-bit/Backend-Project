// Import library yang dibutuhkan
const express = require("express");
const bcrypt = require("bcryptjs"); // Untuk enkripsi password
const jwt = require("jsonwebtoken"); // Untuk membuat token JWT
const User = require("../models/User"); // Model User
const authController = require('../controllers/authController');

// Membuat router baru
const router = express.Router();

// Endpoint untuk registrasi user baru
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cek apakah email sudah digunakan
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "Email already used" });

    // Enkripsi password sebelum disimpan
    const hashed = await bcrypt.hash(password, 10);

    // Simpan user baru ke database
    const user = await User.create({
      email,
      password: hashed,
    });

    res.json({ message: "Register success" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint untuk login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Cari user berdasarkan email
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  // Bandingkan password yang diinput dengan yang tersimpan
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  // Buat token JWT untuk autentikasi
 // Di routes/auth.js
const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET || "kunci_rahasia_darurat_123", // Pakai || sebagai cadangan
  { expiresIn: "1d" }
);

  res.json({ token });
});

// Ekspor router agar bisa digunakan di file utama
module.exports = router;
