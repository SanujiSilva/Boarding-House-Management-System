const express = require("express");
const { generateRoomBill, generateAllRoomBills, getRoomBills, getRoomBill, getRoomBillsByRoom, getRoomBillsByMonth } = require("../controllers/roomBillController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, allowRoles("admin"));
router.post("/generate", generateRoomBill);
router.post("/generate-all", generateAllRoomBills);
router.get("/", getRoomBills);
router.get("/room/:roomId", getRoomBillsByRoom);
router.get("/month/:month/year/:year", getRoomBillsByMonth);
router.get("/:id", getRoomBill);

module.exports = router;

