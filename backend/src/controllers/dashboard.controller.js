const Link = require("../models/Link");

exports.getDashboardStats = async (req, res) => {
  try {
    // 🔒 SAFETY CHECK (THIS WAS MISSING)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const links = await Link.find({ userId: req.user.id });

    const totalLinks = links.length;
    const totalClicks = links.reduce(
      (sum, link) => sum + (link.clickCount || 0),
      0
    );

    return res.json({
      totalLinks,
      totalClicks
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
