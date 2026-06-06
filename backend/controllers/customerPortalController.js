const Customer = require("../models/Customer");
const RoomBill = require("../models/RoomBill");
const Payment = require("../models/Payment");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const currentMonth = () => ({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });

const findCustomer = async (userId) => Customer.findOne({ userId, isActive: true });

const dashboard = async (req, res) => {
  const customer = await findCustomer(req.user._id);
  if (!customer) return res.status(404).json({ message: "Customer profile not found" });
  const now = currentMonth();
  const currentBill = await RoomBill.findOne({ roomId: customer.roomId, month: now.month, year: now.year });
  res.json({ customer, currentBill });
};

const roomBills = async (req, res) => {
  const customer = await findCustomer(req.user._id);
  if (!customer) return res.status(404).json({ message: "Customer profile not found" });
  const filter = { roomId: customer.roomId };
  if (req.query.month) filter.month = Number(req.query.month);
  if (req.query.year) filter.year = Number(req.query.year);
  const bills = await RoomBill.find(filter).sort({ year: -1, month: -1 });
  res.json(bills);
};

const paymentHistory = async (req, res) => {
  const customer = await findCustomer(req.user._id);
  if (!customer) return res.status(404).json({ message: "Customer profile not found" });
  const payments = await Payment.find({ roomId: customer.roomId }).sort({ paymentDate: -1 });
  res.json(payments);
};

const updateContact = async (req, res) => {
  const customer = await findCustomer(req.user._id);
  if (!customer) return res.status(404).json({ message: "Customer profile not found" });
  if (!req.body.phoneNumber) return res.status(400).json({ message: "Phone number is required" });
  customer.phoneNumber = req.body.phoneNumber;
  customer.whatsappNumber = req.body.whatsappNumber || "";
  await customer.save();
  await User.findByIdAndUpdate(customer.userId, { password: await bcrypt.hash(customer.phoneNumber, 10) });
  res.json(customer);
};

module.exports = { dashboard, roomBills, paymentHistory, updateContact };
