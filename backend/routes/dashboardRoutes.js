const express = require("express");
const { dashboard, reports } = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, allowRoles("admin"));
router.get("/dashboard", dashboard);
router.get("/reports", reports);

module.exports = router;

