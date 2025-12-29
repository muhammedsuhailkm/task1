const express = require("express");
const router = express.Router();
const Blog = require("../models/article");
const { scrapeAndUpdateBlog, scrapeBlog } = require("../services/scraper");

router.post("/", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const existingBlog = await Blog.findOne({ url });
    if (existingBlog) {
      return res.status(400).json({ error: "URL already exists in database" });
    }

    const scrapedData = await scrapeBlog(url);

    const blog = new Blog({
      url,
      heading: scrapedData.heading || "",
      publishedDate: scrapedData.publishedDate || "",
      content: scrapedData.content || "",
      status: scrapedData.status,
      error: scrapedData.error || null,
      scrapedAt: new Date(),
    });

    await blog.save();

    res.status(201).json({
      message: "Blog URL added and scraped successfully",
      blog,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/heading/:heading", async (req, res) => {
  try {
    const blog = await Blog.findOne({ heading: req.params.heading });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json(blog.content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:id/scrape", async (req, res) => {
  try {
    const blog = await scrapeAndUpdateBlog(req.params.id);

    res.json({
      message: "Blog scraped successfully",
      blog,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { url, heading, publishedDate, content } = req.body;

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { url, heading, publishedDate, content },
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json({
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json({
      message: "Blog deleted successfully",
      blog,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("scrape-all", async (req, res) => {
  try {
    const pendingBlogs = await Blog.find({ status: "pending" });

    const results = [];
    for (const blog of pendingBlogs) {
      try {
        const updatedBlog = await scrapeAndUpdateBlog(blog._id);
        results.push({ id: blog._id, status: "success", blog: updatedBlog });
      } catch (error) {
        results.push({ id: blog._id, status: "failed", error: error.message });
      }
    }

    res.json({
      message: `Scraped ${results.length} blogs`,
      results,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
