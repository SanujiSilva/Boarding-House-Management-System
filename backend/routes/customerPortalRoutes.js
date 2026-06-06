const express = require("express");
const { dashboard, roomBills, paymentHistory, updateContact } = require("../controllers/customerPortalController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, allowRoles("customer"));
router.get("/dashboard", dashboard);
router.get("/room-bills", roomBills);
router.get("/payment-history", paymentHistory);
router.put("/update-contact", updateContact);

module.exports = router;

