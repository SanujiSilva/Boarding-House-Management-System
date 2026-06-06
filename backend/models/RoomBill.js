const mongoose = require("mongoose");

const roomBillSchema = new mongoose.Schema(
  {
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    roomNumber: { type: String, required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    customerName: { type: String, required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true, min: 2000 },
    roomFee: { type: Number, required: true, min: 0 },
    electricityUsedUnits: { type: Number, default: 0, min: 0 },
    electricityUnitPrice: { type: Number, default: 65, min: 0 },
    electricityBill: { type: Number, default: 0, min: 0 },
    previousMonthBalance: { type: Number, default: 0 },
    totalBill: { type: Number, required: true },
    totalPaidAmount: { type: Number, default: 0, min: 0 },
    currentBalance: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["Paid", "Partially Paid", "Unpaid"], default: "Unpaid" },
    note: { type: String, default: "" }
  },
  { timestamps: true }
);

roomBillSchema.index({ roomId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("RoomBill", roomBillSchema);
