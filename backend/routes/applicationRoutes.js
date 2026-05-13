const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { submitApplication, getUserApplications } = require("../controllers/applicationController");

router.post("/", verifyToken, submitApplication);
router.get("/", verifyToken, getUserApplications);

module.exports = router;