const Link = require("../models/Link");
const generateCode = require("../utils/generateCode");
const bcrypt = require("bcryptjs");


exports.createLink = async (req, res) => {
  try {
    const {
      originalUrl,
      slug,
      password,
      maxClicks,
      expiresAt,
      oneTime,
      scheduledAt
    } = req.body;

    // slug OR random code
    const shortCode = slug || generateCode();

    // check duplicate slug
    const exists = await Link.findOne({ shortCode });
    if (exists)
      return res.status(400).json({ message: "Slug already in use" });

    // hash password if provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const link = await Link.create({
      userId: req.user?.id || null,
      originalUrl,
      shortCode,
      slug: slug || null,
      password: hashedPassword,
      maxClicks: maxClicks || null,
      expiresAt: expiresAt || null,
      oneTime: oneTime || false,
      scheduledAt: scheduledAt || null
    });

    res.status(201).json({
      message: "Link created",
      shortUrl: `${req.protocol}://${req.get("host")}/${shortCode}`
    });
  } catch (err) {
    console.error("Create Link Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.openLink = async (req, res) => {
  try {
    const { code } = req.params;

    const link = await Link.findOne({ shortCode: code });
    if (!link) return res.status(404).send("Link expired or invalid");

    // Scheduled activation check
    if (link.scheduledAt && new Date() < link.scheduledAt) {
      return res.status(403).send("Link not active yet");
    }

    // Expiry check
    if (link.expiresAt && new Date() > link.expiresAt) {
      await link.deleteOne();
      return res.status(410).send("Link expired");
    }

    // Max click limit check
    if (link.maxClicks && link.clickCount >= link.maxClicks) {
      await link.deleteOne();
      return res.status(410).send("Link limit reached");
    }

    // Increment click count
    link.clickCount += 1;
    await link.save();

    // One-time access
    if (link.oneTime) {
      await link.deleteOne();
    }

    // Redirect to original URL
    return res.redirect(link.originalUrl);
  } catch (err) {
    console.error("Open Link Error:", err);
    res.status(500).send("Server error");
  }
};

exports.getMyLinks = async (req, res) => {
  try {
    const links = await Link.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteLink = async (req, res) => {
  try {
    const { id } = req.params;

    const link = await Link.findOne({ _id: id, userId: req.user.id });
    if (!link) return res.status(404).json({ message: "Link not found" });

    await link.deleteOne();
    res.json({ message: "Link deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
