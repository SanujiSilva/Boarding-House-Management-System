const express = require("express");
const { createRoom, getRooms, getRoom, updateRoom, deleteRoom, getNextRoomNumber } = require("../controllers/roomController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, allowRoles("admin"));
router.route("/").post(createRoom).get(getRooms);
router.get("/next-number", getNextRoomNumber);
router.route("/:id").get(getRoom).put(updateRoom).delete(deleteRoom);

module.exports = router;
