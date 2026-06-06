const bcrypt = require("bcryptjs");
const User = require("../models/User");

const listAdmins = async (req, res) => {
  const admins = await User.find({ role: "admin" }).select("-password").sort({ createdAt: -1 });
  res.json(admins);
};

const createAdmin = async (req, res) => {
  const { name, username, password } = req.body;
  if (!name || !username || !password) {
    return res.status(400).json({ message: "Name, username, and password are required" });
  }

  const normalizedUsername = String(username).toLowerCase().trim();
  if (await User.exists({ username: normalizedUsername })) {
    return res.status(409).json({ message: "Duplicate username not allowed" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const admin = await User.create({
    name,
    username: normalizedUsername,
    password: hashed,
    role: "admin"
  });

  res.status(201).json({ id: admin._id, name: admin.name, username: admin.username, role: admin.role, isActive: admin.isActive });
};

const updateProfile = async (req, res) => {
  const { name, username } = req.body;
  const update = {};

  if (name) update.name = name;
  if (username) {
    const normalizedUsername = String(username).toLowerCase().trim();
    const duplicate = await User.exists({ username: normalizedUsername, _id: { $ne: req.user._id } });
    if (duplicate) return res.status(409).json({ message: "Duplicate username not allowed" });
    update.username = normalizedUsername;
  }

  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select("-password");
  res.json(user);
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "Current password, new password, and confirm password are required" });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "New password and confirm password do not match" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters" });
  }

  const user = await User.findById(req.user._id);
  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) return res.status(400).json({ message: "Current password is incorrect" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: "Password changed successfully" });
};

module.exports = { listAdmins, createAdmin, updateProfile, changePassword };

