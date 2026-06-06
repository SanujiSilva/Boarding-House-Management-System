const express = require("express");
const { createPayment, getPayments, getPaymentsByRoom, getPaymentsByCustomer, getPaymentsByBill } = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, allowRoles("admin"));
router.post("/", createPayment);
router.get("/", getPayments);
router.get("/room/:roomId", getPaymentsByRoom);
router.get("/customer/:customerId", getPaymentsByCustomer);
router.get("/bill/:roomBillId", getPaymentsByBill);

module.exports = router;

