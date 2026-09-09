const express = require("express");
const router = express.Router();
const { getAllBlogs, createBlog, getBlog, deleteBlog } = require("../controllers/blogController");

router.get("/", getAllBlogs);
router.post("/", createBlog);
router.delete("/:id", deleteBlog);
router.get("/:identifier", getBlog); // supports slug or id

module.exports = router;