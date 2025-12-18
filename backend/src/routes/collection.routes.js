const express = require("express");
const router = express.Router();
const controller = require("../controllers/collection.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/", auth, controller.createCollection);
router.get("/", auth, controller.getCollections);

module.exports = router;
