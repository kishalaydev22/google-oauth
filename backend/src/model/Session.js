const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const sessionSchema = new Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    valid: {
      type: Boolean,
      default: true,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("Session", sessionSchema);
