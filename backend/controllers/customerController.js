const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Room = require("../models/Room");
const Customer = require("../models/Customer");
const RoomBill = require("../models/RoomBill");
const { syncRoomStatus } = require("./roomController");

const parseBoarders = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};

const filePath = (file) => {
  if (!file) return "";
  const normalized = file.path.replace(/\\/g, "/");
  return normalized.slice(normalized.indexOf("uploads/"));
};

const getRoomOccupancy = async (roomId, excludeCustomerId = null) => {
  const filter = { roomId, isActive: true };
  if (excludeCustomerId) filter._id = { $ne: excludeCustomerId };
  return Customer.countDocuments(filter);
};

const refreshRoomOccupancy = async (roomId) => {
  const room = await Room.findById(roomId);
  if (!room) return;
  room.currentBoarders = await getRoomOccupancy(room._id);
  syncRoomStatus(room);
  await room.save();
};

const createCustomer = async (req, res) => {
  const body = req.body;
  const files = req.files || {};
  const nicFile = files.nicPhoto?.[0];
  const marriageFile = files.marriageCertificate?.[0];

  if (!nicFile) return res.status(400).json({ message: "NIC photo is required" });
  if (body.marriedStatus === "Married" && !marriageFile) {
    return res.status(400).json({ message: "Marriage certificate is required for married customers" });
  }
  if (!body.email) return res.status(400).json({ message: "Email is required" });
  if (!body.phoneNumber) return res.status(400).json({ message: "Phone number is required" });

  const room = body.roomId ? await Room.findById(body.roomId) : await Room.findOne({ roomNumber: body.roomNumber });
  if (!room) return res.status(404).json({ message: "Room not found" });
  const username = String(body.email || "").toLowerCase().trim();
  if (await User.exists({ username })) return res.status(409).json({ message: "Duplicate email not allowed" });

  const currentOccupancy = await getRoomOccupancy(room._id);
  if (currentOccupancy >= room.maxBoarders) return res.status(400).json({ message: "Room does not have enough capacity" });

  const password = await bcrypt.hash(body.phoneNumber, 10);
  const user = await User.create({ name: body.name, username, password, role: "customer" });
  const customer = await Customer.create({
    userId: user._id,
    roomId: room._id,
    roomNumber: room.roomNumber,
    name: body.name,
    address: body.address,
    email: username,
    phoneNumber: body.phoneNumber,
    whatsappNumber: body.whatsappNumber,
    job: body.job,
    relationship: body.relationship,
    nicNumber: body.nicNumber,
    nicPhoto: filePath(nicFile),
    marriedStatus: body.marriedStatus || "Single",
    marriageCertificate: filePath(marriageFile),
    numberOfBoardersInRoom: 0,
    boarderDetails: [],
    roomFee: Number(body.roomFee || room.monthlyRent)
  });

  await refreshRoomOccupancy(room._id);
  res.status(201).json(customer);
};

const getCustomers = async (req, res) => {
  const q = req.query.search || "";
  const status = req.query.status || "all";
  const filter = q
    ? { $or: [{ name: new RegExp(q, "i") }, { email: new RegExp(q, "i") }, { phoneNumber: new RegExp(q, "i") }, { nicNumber: new RegExp(q, "i") }, { roomNumber: new RegExp(q, "i") }] }
    : {};
  if (status === "active") filter.isActive = true;
  if (status === "previous") filter.isActive = false;
  if (req.query.roomId) filter.roomId = req.query.roomId;
  const customers = await Customer.find(filter).populate("userId", "username isActive").sort({ createdAt: -1 });
  res.json(customers);
};

const getCustomer = async (req, res) => {
  const customer = await Customer.findById(req.params.id).populate("userId", "username isActive").populate("roomId");
  if (!customer) return res.status(404).json({ message: "Customer not found" });
  const bills = await RoomBill.find({ roomId: customer.roomId._id }).sort({ year: -1, month: -1 });
  const previousMembers = await Customer.find({
    roomId: customer.roomId._id,
    isActive: false,
    _id: { $ne: customer._id }
  }).sort({ updatedAt: -1 });
  res.json({ customer, bills, previousMembers });
};

const updateCustomer = async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).json({ message: "Customer not found" });

  const originalRoomId = customer.roomId;
  const allowed = ["name", "address", "email", "phoneNumber", "whatsappNumber", "job", "relationship", "nicNumber", "marriedStatus", "roomFee", "isActive"];
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) customer[key] = key === "email" ? String(req.body[key]).toLowerCase().trim() : req.body[key];
  });

  const userUpdate = {};
  if (req.body.email) {
    const duplicate = await User.exists({ username: customer.email, _id: { $ne: customer.userId } });
    if (duplicate) return res.status(409).json({ message: "Duplicate email not allowed" });
    userUpdate.username = customer.email;
  }
  if (req.body.name) userUpdate.name = customer.name;
  if (req.body.phoneNumber) userUpdate.password = await bcrypt.hash(customer.phoneNumber, 10);
  if (Object.keys(userUpdate).length) await User.findByIdAndUpdate(customer.userId, userUpdate);

  if (req.body.roomId && String(req.body.roomId) !== String(customer.roomId)) {
    const room = await Room.findById(req.body.roomId);
    if (!room) return res.status(404).json({ message: "New room not found" });
    customer.roomId = room._id;
    customer.roomNumber = room.roomNumber;
  }

  const targetRoom = await Room.findById(customer.roomId);
  if (!targetRoom) return res.status(404).json({ message: "Assigned room not found" });
  const occupancyWithoutThis = await getRoomOccupancy(targetRoom._id, customer._id);
  if (customer.isActive && occupancyWithoutThis + 1 > targetRoom.maxBoarders) {
    return res.status(400).json({ message: "Room does not have enough capacity for these boarders" });
  }

  await customer.save();
  await refreshRoomOccupancy(targetRoom._id);

  if (String(originalRoomId) !== String(customer.roomId)) {
    await refreshRoomOccupancy(originalRoomId);
  }

  res.json(customer);
};

const deleteCustomer = async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).json({ message: "Customer not found" });
  customer.isActive = false;
  await customer.save();
  await User.findByIdAndUpdate(customer.userId, { isActive: false });
  await refreshRoomOccupancy(customer.roomId);
  res.json({ message: "Customer deactivated" });
};

module.exports = { createCustomer, getCustomers, getCustomer, updateCustomer, deleteCustomer };
