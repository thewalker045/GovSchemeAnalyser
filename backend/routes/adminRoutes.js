const express = require("express");
const router = express.Router();
const { verifyAdmin } = require("../middleware/authMiddleware");
const { getAllApplications, updateApplicationStatus, getStats } = require("../controllers/adminController");

router.get("/applications", verifyAdmin, getAllApplications);
router.put("/applications/:id/status", verifyAdmin, updateApplicationStatus);
router.get("/stats", verifyAdmin, getStats);

module.exports = router;