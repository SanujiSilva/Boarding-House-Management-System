const Room = require("../models/Room");
const Customer = require("../models/Customer");

const syncRoomStatus = (room) => {
  if (room.currentBoarders <= 0) room.status = "Available";
  else if (room.currentBoarders >= room.maxBoarders) room.status = "Full";
  else room.status = "Occupied";
};

const createRoom = async (req, res) => {
  const room = new Room({
    roomType: "Standard",
    maxBoarders: 1,
    currentBoarders: 0,
    ...req.body
  });
  syncRoomStatus(room);
  await room.save();
  res.status(201).json(room);
};

const getRooms = async (req, res) => {
  const q = req.query.search || "";
  const filter = q ? { $or: [{ roomNumber: new RegExp(q, "i") }, { roomType: new RegExp(q, "i") }, { status: new RegExp(q, "i") }] } : {};
  if (req.query.status === "Available") filter.status = "Available";
  if (req.query.status === "Unavailable") filter.status = { $in: ["Occupied", "Full"] };
  const rooms = await Room.find(filter).sort({ roomNumber: 1 });
  res.json(rooms);
};

const getNextRoomNumber = async (req, res) => {
  const rooms = await Room.find({}, "roomNumber");
  const max = rooms.reduce((highest, room) => {
    const match = String(room.roomNumber || "").match(/\d+/);
    const value = match ? Number(match[0]) : 0;
    return Math.max(highest, value);
  }, 0);
  res.json({ roomNumber: `R${String(max + 1).padStart(3, "0")}` });
};

const getRoom = async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).json({ message: "Room not found" });
  const customers = await Customer.find({ roomId: room._id, isActive: true });
  res.json({ room, customers });
};

const updateRoom = async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).json({ message: "Room not found" });
  Object.assign(room, req.body);
  syncRoomStatus(room);
  await room.save();
  res.json(room);
};

const deleteRoom = async (req, res) => {
  const active = await Customer.exists({ roomId: req.params.id, isActive: true });
  if (active) return res.status(400).json({ message: "Cannot delete a room with active customers" });
  const room = await Room.findByIdAndDelete(req.params.id);
  if (!room) return res.status(404).json({ message: "Room not found" });
  res.json({ message: "Room deleted" });
};

module.exports = { createRoom, getRooms, getRoom, updateRoom, deleteRoom, getNextRoomNumber, syncRoomStatus };
