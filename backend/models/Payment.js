const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    roomBillId: { type: mongoose.Schema.Types.ObjectId, ref: "RoomBill", required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    roomNumber: { type: String, required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    customerName: { type: String, required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true, min: 2000 },
    paidAmount: { type: Number, required: true, min: 1 },
    receivedAmount: { type: Number, default: 0, min: 0 },
    changeAmount: { type: Number, default: 0, min: 0 },
    overPaymentAction: { type: String, enum: ["None", "Give Change", "Carry Forward"], default: "None" },
    paymentDate: { type: Date, default: Date.now },
    paymentMethod: { type: String, enum: ["Cash", "Bank Transfer", "Online Payment", "Other"], default: "Cash" },
    note: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
