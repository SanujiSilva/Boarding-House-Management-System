const Room = require("../models/Room");
const Customer = require("../models/Customer");
const RoomBill = require("../models/RoomBill");
const Payment = require("../models/Payment");

const currentFilter = () => ({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });

const dashboard = async (req, res) => {
  const now = currentFilter();
  const rooms = await Room.find();
  const customers = await Customer.find({ isActive: true });
  const bills = await RoomBill.find(now).sort({ currentBalance: -1 });
  const payments = await Payment.find(now).sort({ paymentDate: -1 }).limit(8);

  const currentMonthTotalBillAmount = bills.reduce((sum, bill) => sum + bill.totalBill, 0);
  const currentMonthTotalPaidAmount = bills.reduce((sum, bill) => sum + bill.totalPaidAmount, 0);
  const currentMonthPendingBalance = bills.reduce((sum, bill) => sum + bill.currentBalance, 0);

  res.json({
    totalRooms: rooms.length,
    availableRooms: rooms.filter((room) => room.status === "Available").length,
    occupiedRooms: rooms.filter((room) => room.status === "Occupied").length,
    fullRooms: rooms.filter((room) => room.status === "Full").length,
    totalCustomers: customers.length,
    totalBoarders: customers.length,
    currentMonthTotalBillAmount,
    currentMonthTotalPaidAmount,
    currentMonthPendingBalance,
    recentPayments: payments,
    roomsWithUnpaidBills: bills.filter((bill) => bill.paymentStatus === "Unpaid")
  });
};

const reports = async (req, res) => {
  const month = req.query.month ? Number(req.query.month) : new Date().getMonth() + 1;
  const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();
  const filter = { month, year };
  const bills = await RoomBill.find(filter).sort({ roomNumber: 1 });
  const payments = await Payment.find(filter).sort({ paymentDate: -1 });
  const totals = {
    expectedIncome: bills.reduce((sum, bill) => sum + bill.totalBill, 0),
    paid: bills.reduce((sum, bill) => sum + bill.totalPaidAmount, 0),
    unpaidBalance: bills.reduce((sum, bill) => sum + Math.max(Number(bill.currentBalance || 0), 0), 0),
    electricityIncome: bills.reduce((sum, bill) => sum + bill.electricityBill, 0)
  };
  res.json({ month, year, totals, bills, payments });
};

module.exports = { dashboard, reports };
