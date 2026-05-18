const express = require("express");
const router = express.Router();
const { verifyAdmin } = require("../middleware/authMiddleware");
const {
  getAllApplications,
  getApplicationById,          // ← added
  updateApplicationStatus,
  getStats,
} = require("../controllers/adminController");

router.get("/applications", verifyAdmin, getAllApplications);
router.get("/applications/:id", verifyAdmin, getApplicationById);  // ← added, must be AFTER the line above
router.put("/applications/:id/status", verifyAdmin, updateApplicationStatus);
router.get("/stats", verifyAdmin, getStats);

module.exports = router;