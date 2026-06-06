const Room = require("../models/Room");
const Customer = require("../models/Customer");
const Electricity = require("../models/Electricity");
const RoomBill = require("../models/RoomBill");
const Payment = require("../models/Payment");

const previousMonth = (month, year) => (month === 1 ? { month: 12, year: year - 1 } : { month: month - 1, year });

const getPaymentStatus = (totalPaidAmount, currentBalance) => {
  if (currentBalance <= 0) return "Paid";
  if (totalPaidAmount > 0 && currentBalance > 0) return "Partially Paid";
  return "Unpaid";
};

const buildBill = async (room, month, year, note = "") => {
  const customer = await Customer.findOne({ roomId: room._id, isActive: true });
  if (!customer) return { skipped: true, reason: "No active boarder record" };

  const existing = await RoomBill.findOne({ roomId: room._id, month, year });
  if (existing) return { skipped: true, reason: "Bill already exists", bill: existing };

  const electricity = await Electricity.findOne({ roomId: room._id, month, year });
  if (!electricity) return { skipped: true, reason: "Electricity record missing" };

  const prev = previousMonth(month, year);
  const prevBill = await RoomBill.findOne({ roomId: room._id, month: prev.month, year: prev.year });
  const previousMonthBalance = prevBill?.currentBalance || 0;
  const roomFee = customer.roomFee || room.monthlyRent;
  const totalBill = roomFee + electricity.electricityBill + previousMonthBalance;

  const bill = await RoomBill.create({
    roomId: room._id,
    roomNumber: room.roomNumber,
    customerId: customer._id,
    customerName: customer.name,
    month,
    year,
    roomFee,
    electricityUsedUnits: electricity.usedUnits,
    electricityUnitPrice: electricity.unitPrice,
    electricityBill: electricity.electricityBill,
    previousMonthBalance,
    totalBill,
    totalPaidAmount: 0,
    currentBalance: totalBill,
    paymentStatus: getPaymentStatus(0, totalBill),
    note
  });
  return { skipped: false, bill };
};

const generateRoomBill = async (req, res) => {
  const { roomId, month, year, note } = req.body;
  const room = await Room.findById(roomId);
  if (!room) return res.status(404).json({ message: "Room not found" });
  const result = await buildBill(room, Number(month), Number(year), note);
  if (result.skipped) return res.status(400).json({ message: result.reason, bill: result.bill });
  res.status(201).json(result.bill);
};

const generateAllRoomBills = async (req, res) => {
  const month = Number(req.body.month);
  const year = Number(req.body.year);
  const rooms = await Room.find({ status: { $in: ["Occupied", "Full"] } }).sort({ roomNumber: 1 });
  const generated = [];
  const skipped = [];

  for (const room of rooms) {
    const result = await buildBill(room, month, year, req.body.note || "");
    if (result.skipped) skipped.push({ roomNumber: room.roomNumber, reason: result.reason });
    else generated.push(result.bill);
  }

  res.json({ generatedCount: generated.length, skippedCount: skipped.length, generated, skipped });
};

const getRoomBills = async (req, res) => {
  const filter = {};
  if (req.query.month) filter.month = Number(req.query.month);
  if (req.query.year) filter.year = Number(req.query.year);
  if (req.query.roomId) filter.roomId = req.query.roomId;
  const bills = await RoomBill.find(filter).sort({ year: -1, month: -1, roomNumber: 1 });
  res.json(bills);
};

const getRoomBill = async (req, res) => {
  const bill = await RoomBill.findById(req.params.id);
  if (!bill) return res.status(404).json({ message: "Room bill not found" });
  const payments = await Payment.find({ roomBillId: bill._id }).sort({ paymentDate: -1 });
  res.json({ bill, payments });
};

const getRoomBillsByRoom = async (req, res) => {
  const bills = await RoomBill.find({ roomId: req.params.roomId }).sort({ year: -1, month: -1 });
  res.json(bills);
};

const getRoomBillsByMonth = async (req, res) => {
  const bills = await RoomBill.find({ month: Number(req.params.month), year: Number(req.params.year) }).sort({ roomNumber: 1 });
  res.json(bills);
};

module.exports = { generateRoomBill, generateAllRoomBills, getRoomBills, getRoomBill, getRoomBillsByRoom, getRoomBillsByMonth, getPaymentStatus };
