const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");

const {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");

/*
|--------------------------------------------------------------------------
| PRODUCT ROUTES
|--------------------------------------------------------------------------
| Prefix dari server.js:
|   app.use("/api/products", productRoutes);
|
| Jadi semua route di bawah otomatis diawali:
|   /api/products
|--------------------------------------------------------------------------
*/

/* =========================
   CREATE PRODUCT
   POST /api/products
========================= */
router.post("/", upload.single("image"), createProduct);

/* =========================
   GET ALL PRODUCTS
   GET /api/products
========================= */
router.get("/", getProducts);

/* =========================
   GET PRODUCT BY ID
   GET /api/products/:id
========================= */
router.get("/:id", getProductById);

/* =========================
   UPDATE PRODUCT
   PUT /api/products/:id
========================= */
router.put("/:id", upload.single("image"), updateProduct);

/* =========================
   DELETE PRODUCT
   DELETE /api/products/:id
========================= */
router.delete("/:id", deleteProduct);

module.exports = router;
