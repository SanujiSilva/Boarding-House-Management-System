const mongoose = require("mongoose");

const electricitySchema = new mongoose.Schema(
  {
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    roomNumber: { type: String, required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true, min: 2000 },
    previousMeterReading: { type: Number, required: true, min: 0 },
    currentMeterReading: { type: Number, required: true, min: 0 },
    usedUnits: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, default: 65, min: 0 },
    electricityBill: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

electricitySchema.index({ roomId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("Electricity", electricitySchema);

