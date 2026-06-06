require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");

const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const customerRoutes = require("./routes/customerRoutes");
const electricityRoutes = require("./routes/electricityRoutes");
const roomBillRoutes = require("./routes/roomBillRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const customerPortalRoutes = require("./routes/customerPortalRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => res.json({ message: "Boarding House Management System API" }));
app.use("/api/auth", authRoutes);
app.use("/api/admin/rooms", roomRoutes);
app.use("/api/admin/customers", customerRoutes);
app.use("/api/admin/electricity", electricityRoutes);
app.use("/api/admin/room-bills", roomBillRoutes);
app.use("/api/admin/payments", paymentRoutes);
app.use("/api/admin", dashboardRoutes);
app.use("/api/admin", adminUserRoutes);
app.use("/api/customer", customerPortalRoutes);

app.use((err, req, res, next) => {
  if (err?.code === 11000) {
    return res.status(409).json({ message: `Duplicate value for ${Object.keys(err.keyValue || {}).join(", ")}` });
  }
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Server error" });
});

const ensureAdmin = async () => {
  const username = (process.env.ADMIN_USERNAME || "admin").toLowerCase();
  const exists = await User.findOne({ username });
  if (exists) return;

  const password = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 10);
  await User.create({
    name: process.env.ADMIN_NAME || "System Admin",
    username,
    password,
    role: "admin"
  });
  console.log(`Default admin created: ${username}`);
};

const start = async () => {
  await connectDB();
  await ensureAdmin();
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`API running on http://localhost:${port}`));
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
