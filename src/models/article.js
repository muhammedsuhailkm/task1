const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    heading: {
      type: String,
      default: "",
    },
    publishedDate: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    scrapedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "scraped", "failed"],
      default: "pending",
    },
    error: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", blogSchema);
