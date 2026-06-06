const mongoose = require("mongoose");

const boarderSchema = new mongoose.Schema(
  {
    boarderName: String,
    boarderNIC: String,
    boarderPhone: String,
    relationship: String,
    job: String
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    roomNumber: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    address: { type: String, default: "" },
    email: { type: String, required: true, lowercase: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    whatsappNumber: { type: String, default: "" },
    job: { type: String, default: "" },
    relationship: { type: String, default: "" },
    nicNumber: { type: String, required: true, trim: true },
    nicPhoto: { type: String, required: true },
    marriedStatus: { type: String, enum: ["Single", "Married"], default: "Single" },
    marriageCertificate: { type: String, default: "" },
    numberOfBoardersInRoom: { type: Number, default: 0, min: 0 },
    boarderDetails: [boarderSchema],
    roomFee: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

customerSchema.index({ nicNumber: 1 }, { unique: true });
customerSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("Customer", customerSchema);
