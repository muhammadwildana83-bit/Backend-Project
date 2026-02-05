// Import library multer untuk menangani upload file
const multer = require("multer");
// Import library path untuk menangani dan memanipulasi path file
const path = require("path");

// Konfigurasi penyimpanan file menggunakan diskStorage
const storage = multer.diskStorage({
  // Menentukan folder tujuan penyimpanan file
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  // Menentukan nama file yang akan disimpan
  filename: (req, file, cb) => {
    // Nama file: timestamp + ekstensi asli
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

// Membuat middleware upload dengan konfigurasi storage di atas
const upload = multer({ storage });

// Ekspor middleware upload agar bisa digunakan di file lain
module.exports = upload;
