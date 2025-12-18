const express = require("express");
const router = express.Router();
const controller = require("../controllers/dashboard.controller");
const auth = require("../middlewares/auth.middleware");

router.get("/", auth, controller.getDashboardStats);

module.exports = router;
