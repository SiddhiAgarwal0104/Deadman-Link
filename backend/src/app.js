const express = require("express");
const cors = require("cors");

const app = express();
const linkRoutes = require("./routes/link.routes");
const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const collectionRoutes = require("./routes/collection.routes");

// middlewares
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use("/api/auth", authRoutes);

app.use("/api/link", linkRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use("/", linkRoutes);
app.use("/api/collections", collectionRoutes);

module.exports = app;
