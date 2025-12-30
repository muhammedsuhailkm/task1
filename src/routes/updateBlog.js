const express = require("express");
const router = express.Router();
const updateBlog = require("../models/updatedArticle");

const blogService = require("../services/blogService");
const googleService = require("../services/googleServices");
const scraper = require("../services/scraper");
const llmService = require("../services/llmService");

const enhanceBlogByHeading = async (req, res) => {
  try {
    const heading = decodeURIComponent(req.params.heading);

    const originalBlog = await blogService.getBlogByHeading(heading);
    if (!originalBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const searchResults = await googleService.search(heading);
    const topBlogs = searchResults.slice(0, 2);

    const referenceContents = await Promise.all(
      topBlogs.map((blog) => scraper.scrapeBlog(blog.link))
    );

    const improvedContent = await llmService.enhanceArticle({
      original: originalBlog.content,
      reference1: referenceContents[0],
      reference2: referenceContents[1],
    });

    const finalContent = `
${improvedContent}

References:
1. ${topBlogs[0].link}
2. ${topBlogs[1].link}
`;

    const updatedBlog = await blogService.updateBlogById(
      originalBlog._id,
      finalContent
    );

    res.status(200).json(updatedBlog.content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Blog enhancement failed" });
  }
};

router.post("/:heading", enhanceBlogByHeading);
router.delete("/heading/:heading", async (req, res) => {
  try {
    const blog = await updateBlog.findOneAndDelete({
      heading: req.params.heading,
    });

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

module.exports = router;
