const Article = require("../models/article");
const updatedBlog = require("../models/updatedArticle");

exports.getBlogByHeading = async (heading) => {
  return await Article.findOne({ heading }).select("content");
};

exports.updateBlogById = async (id, content) => {
  // Find the original article
  const originalArticle = await Article.findById(id);

  if (!originalArticle) {
    throw new Error("Article not found");
  }

  // Create a new object with all properties from original article and new content
  const updatedData = {
    ...originalArticle.toObject(),
    content: content,
  };

  // Save to the updatedBlog collection
  const newUpdatedBlog = new updatedBlog(updatedData);
  return await newUpdatedBlog.save();
};
