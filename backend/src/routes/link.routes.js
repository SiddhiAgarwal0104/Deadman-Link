const express = require("express");
const router = express.Router();
const controller = require("../controllers/link.controller");
const auth = require("../middlewares/auth.middleware");

// create link
router.post("/", auth, controller.createLink);

// dashboard links
router.get("/my", auth, controller.getMyLinks);

// delete link
router.delete("/:id", auth, controller.deleteLink);

// redirect (NO auth)
router.get("/:code", controller.openLink);

module.exports = router;
