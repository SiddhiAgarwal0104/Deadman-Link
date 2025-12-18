const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  originalUrl: String,
  shortCode: { type: String, unique: true },

  slug: String,

  password: String, // hashed
  maxClicks: Number,
  clickCount: { type: Number, default: 0 },

  expiresAt: Date,
  oneTime: { type: Boolean, default: false },

  collectionId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Collection"
  },

  scheduledAt: Date, // ADVANCED FEATURE ✔

  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Link", linkSchema);
