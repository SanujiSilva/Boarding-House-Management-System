const Payment = require("../models/Payment");
const RoomBill = require("../models/RoomBill");
const { getPaymentStatus } = require("./roomBillController");

const recalcBill = async (billId) => {
  const bill = await RoomBill.findById(billId);
  const payments = await Payment.find({ roomBillId: billId });
  const totalPaidAmount = payments.reduce((sum, payment) => sum + payment.paidAmount, 0);
  bill.totalPaidAmount = totalPaidAmount;
  bill.currentBalance = bill.totalBill - totalPaidAmount;
  bill.paymentStatus = getPaymentStatus(bill.totalPaidAmount, bill.currentBalance);
  await bill.save();
  return bill;
};

const createPayment = async (req, res) => {
  const { roomBillId, paymentDate, paymentMethod, note } = req.body;
  const bill = await RoomBill.findById(roomBillId);
  if (!bill) return res.status(404).json({ message: "Room bill must exist" });

  const fullBalance = Number(bill.currentBalance);
  const receivedAmount = Number(req.body.receivedAmount ?? req.body.paidAmount);
  let amount = Number(req.body.paidAmount ?? receivedAmount);
  let changeAmount = Number(req.body.changeAmount || 0);
  let overPaymentAction = req.body.overPaymentAction || "None";

  if (!receivedAmount || receivedAmount <= 0) return res.status(400).json({ message: "Received amount must be greater than 0" });

  if (fullBalance > 0 && receivedAmount > fullBalance) {
    if (!["Give Change", "Carry Forward"].includes(overPaymentAction)) {
      return res.status(400).json({ message: "Choose whether to give change or carry overpayment forward" });
    }

    if (overPaymentAction === "Give Change") {
      amount = fullBalance;
      changeAmount = receivedAmount - fullBalance;
    } else {
      amount = receivedAmount;
      changeAmount = 0;
    }
  } else {
    amount = receivedAmount;
    changeAmount = 0;
    overPaymentAction = "None";
  }

  if (!amount || amount <= 0) return res.status(400).json({ message: "Paid amount must be greater than 0" });

  const payment = await Payment.create({
    roomBillId: bill._id,
    roomId: bill.roomId,
    roomNumber: bill.roomNumber,
    customerId: bill.customerId,
    customerName: bill.customerName,
    month: bill.month,
    year: bill.year,
    paidAmount: amount,
    receivedAmount,
    changeAmount,
    overPaymentAction,
    paymentDate: paymentDate || Date.now(),
    paymentMethod: paymentMethod || "Cash",
    note
  });
  const updatedBill = await recalcBill(bill._id);
  res.status(201).json({ payment, bill: updatedBill });
};

const getPayments = async (req, res) => {
  const payments = await Payment.find().sort({ paymentDate: -1 });
  res.json(payments);
};

const getPaymentsByRoom = async (req, res) => {
  const payments = await Payment.find({ roomId: req.params.roomId }).sort({ paymentDate: -1 });
  res.json(payments);
};

const getPaymentsByCustomer = async (req, res) => {
  const payments = await Payment.find({ customerId: req.params.customerId }).sort({ paymentDate: -1 });
  res.json(payments);
};

const getPaymentsByBill = async (req, res) => {
  const payments = await Payment.find({ roomBillId: req.params.roomBillId }).sort({ paymentDate: -1 });
  res.json(payments);
};

module.exports = { createPayment, getPayments, getPaymentsByRoom, getPaymentsByCustomer, getPaymentsByBill };
