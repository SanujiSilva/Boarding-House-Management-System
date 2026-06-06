const Room = require("../models/Room");
const Electricity = require("../models/Electricity");

const previousMonth = (month, year) => (month === 1 ? { month: 12, year: year - 1 } : { month: month - 1, year });

const createElectricity = async (req, res) => {
  const { roomId, month, year, previousMeterReading, currentMeterReading } = req.body;
  const numericMonth = Number(month);
  const numericYear = Number(year);
  const unitPrice = Number(req.body.unitPrice || 65);
  const room = await Room.findById(roomId);
  if (!room) return res.status(404).json({ message: "Room not found" });

  const prev = previousMonth(numericMonth, numericYear);
  const previousRecord = await Electricity.findOne({ roomId, month: prev.month, year: prev.year });
  const previous = previousRecord
    ? Number(previousRecord.currentMeterReading)
    : Number(previousMeterReading);
  const current = Number(currentMeterReading);
  if (current <= previous) return res.status(400).json({ message: "Current meter reading must be greater than previous meter reading" });

  const usedUnits = current - previous;
  const electricityBill = usedUnits * unitPrice;
  const record = await Electricity.findOneAndUpdate(
    { roomId, month: numericMonth, year: numericYear },
    { roomId, roomNumber: room.roomNumber, month: numericMonth, year: numericYear, previousMeterReading: previous, currentMeterReading: current, usedUnits, unitPrice, electricityBill },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  res.status(201).json(record);
};

const getElectricity = async (req, res) => {
  const records = await Electricity.find().populate("roomId").sort({ year: -1, month: -1, roomNumber: 1 });
  res.json(records);
};

const getElectricityByRoom = async (req, res) => {
  const records = await Electricity.find({ roomId: req.params.roomId }).sort({ year: -1, month: -1 });
  res.json(records);
};

const getElectricityByMonth = async (req, res) => {
  const records = await Electricity.find({ month: Number(req.params.month), year: Number(req.params.year) }).sort({ roomNumber: 1 });
  res.json(records);
};

module.exports = { createElectricity, getElectricity, getElectricityByRoom, getElectricityByMonth };
