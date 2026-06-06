const express = require("express");
const { createCustomer, getCustomers, getCustomer, updateCustomer, deleteCustomer } = require("../controllers/customerController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();
const customerUpload = upload.fields([
  { name: "nicPhoto", maxCount: 1 },
  { name: "marriageCertificate", maxCount: 1 }
]);

router.use(protect, allowRoles("admin"));
router.route("/").post(customerUpload, createCustomer).get(getCustomers);
router.route("/:id").get(getCustomer).put(customerUpload, updateCustomer).delete(deleteCustomer);

module.exports = router;

