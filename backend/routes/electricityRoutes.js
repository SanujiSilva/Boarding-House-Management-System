const express = require("express");
const { createElectricity, getElectricity, getElectricityByRoom, getElectricityByMonth } = require("../controllers/electricityController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, allowRoles("admin"));
router.post("/", createElectricity);
router.get("/", getElectricity);
router.get("/room/:roomId", getElectricityByRoom);
router.get("/month/:month/year/:year", getElectricityByMonth);

module.exports = router;

