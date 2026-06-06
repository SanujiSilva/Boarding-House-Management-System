const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Customer = require("../models/Customer");

const signToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password are required" });

  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user || !user.isActive) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  res.json({ token: signToken(user), user: { id: user._id, name: user.name, username: user.username, role: user.role } });
};

const me = async (req, res) => {
  const customer = req.user.role === "customer" ? await Customer.findOne({ userId: req.user._id }) : null;
  res.json({ user: req.user, customer });
};

module.exports = { login, me };

