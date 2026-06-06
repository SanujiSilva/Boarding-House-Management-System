const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true, trim: true },
    roomType: { type: String, required: true, trim: true },
    monthlyRent: { type: Number, required: true, min: 0 },
    maxBoarders: { type: Number, required: true, min: 1 },
    currentBoarders: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ["Available", "Occupied", "Full"], default: "Available" },
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);

