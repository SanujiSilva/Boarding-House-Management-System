const express = require("express");
const { listAdmins, createAdmin, updateProfile, changePassword } = require("../controllers/adminUserController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, allowRoles("admin"));
router.get("/admins", listAdmins);
router.post("/admins", createAdmin);
router.put("/profile", updateProfile);
router.put("/profile/password", changePassword);

module.exports = router;

