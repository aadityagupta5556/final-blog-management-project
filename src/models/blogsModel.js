const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: {
      type: String,
      required: true,
    },
    authorId: {
      required: true,
      type: ObjectId,
      ref: "Author",
    },
    tags: Array,
    category: { type: String, required: true },
    subcategory: Array,
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blogs", blogsSchema);
