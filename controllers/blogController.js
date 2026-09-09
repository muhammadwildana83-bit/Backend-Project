const mongoose = require("mongoose");
const Blog = require("../models/Blog");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const slugify = (text) =>
  String(text || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const { title, slug, content, excerpt, category, image, readTime, featured } = req.body;
    const finalSlug = slug && slug.trim() !== "" ? slugify(slug) : slugify(title);

    const newBlog = await Blog.create({
      title,
      slug: finalSlug,
      content,
      excerpt,
      category,
      image,
      readTime,
      featured,
    });

    res.status(201).json({ success: true, data: newBlog });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get blog by slug or id (smart resolver)
exports.getBlog = async (req, res) => {
  try {
    const { identifier } = req.params;

    // Prefer slug lookup first
    let blog = await Blog.findOne({ slug: identifier });

    // If not found and identifier looks like ObjectId, try findById
    if (!blog && isValidObjectId(identifier)) {
      blog = await Blog.findById(identifier);
    }

    if (!blog) {
      return res.status(404).json({ success: false, message: "Artikel tidak ditemukan" });
    }

    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ success: false, message: "Blog tidak ditemukan" });
    }

    res.status(200).json({ success: true, message: "Blog berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};