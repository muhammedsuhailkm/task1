const Article = require("../models/article");

exports.getBlogByHeading = async (heading) => {
  return await Article.findOne({ heading }).select("content");
};

exports.updateBlogById = async (id, content) => {
  return await Article.findByIdAndUpdate(id, { content }, { new: true });
};
