const axios = require("axios");
const cheerio = require("cheerio");
const Blog = require("../models/article");

async function scrapeBlog(url) {
  try {
    const { data: html } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 10000,
    });

    const $ = cheerio.load(html);

    const heading = $("h1").first().text().trim();

    const publishedDateText = $(".elementor-icon-list-text time")
      .first()
      .text()
      .trim();
    const publishedDate = publishedDateText
      ? new Date(publishedDateText).toISOString().split("T")[0]
      : "";

    const paragraphs = [];

    $(".elementor-widget-theme-post-content p").each((_, el) => {
      const text = $(el).text().trim();
      if (text) {
        paragraphs.push(text);
      }
    });

    return {
      heading,
      publishedDate,
      content: paragraphs.join("\n\n"),
      status: "scraped",
      scrapedAt: new Date(),
    };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return {
      status: "failed",
      error: error.message,
    };
  }
}

async function scrapeAndUpdateBlog(blogId) {
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }

    const scrapedData = await scrapeBlog(blog.url);

    blog.heading = scrapedData.heading || blog.heading;
    blog.publishedDate = scrapedData.publishedDate || blog.publishedDate;
    blog.content = scrapedData.content || blog.content;
    blog.status = scrapedData.status;
    blog.error = scrapedData.error || null;
    blog.scrapedAt = new Date();

    await blog.save();
    return blog;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  scrapeBlog,
  scrapeAndUpdateBlog,
};
