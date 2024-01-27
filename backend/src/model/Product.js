const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("Product", productSchema);
