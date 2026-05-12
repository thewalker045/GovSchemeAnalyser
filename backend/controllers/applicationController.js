const pool = require("../config/db");

// POST /api/applications
async function submitApplication(req, res) {
  const { schemeId, applicantName, phone, aadhaar, state, income } = req.body;
  const userId = req.user.userId;

  try {
    // Get scheme details
    const schemeResult = await pool.query("SELECT * FROM schemes WHERE scheme_id = $1", [schemeId]);
    if (schemeResult.rows.length === 0) {
      return res.status(404).json({ message: "Scheme not found." });
    }
    const scheme = schemeResult.rows[0];

    // Check eligibility
    if (income > scheme.income_limit) {
      return res.status(400).json({ message: `Not Eligible! Your income is above the eligibility limit of Rs. ${scheme.income_limit}.` });
    }

    const result = await pool.query(
      `INSERT INTO applications
        (user_id, scheme_name, category, ministry, applicant_name, phone, aadhaar_number, state, income, status, submitted_on, next_step)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Submitted', NOW(), 'Document verification pending')
       RETURNING application_id`,
      [userId, scheme.name, scheme.category, scheme.ministry, applicantName, phone, aadhaar, state, income]
    );

    res.status(201).json({ message: "Application submitted successfully.", applicationId: result.rows[0].application_id });
  } catch (err) {
    console.error("Submit application error:", err);
    res.status(500).json({ message: "Server error." });
  }
}

// GET /api/applications
async function getUserApplications(req, res) {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      "SELECT * FROM applications WHERE user_id = $1 ORDER BY submitted_on DESC",
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Get applications error:", err);
    res.status(500).json({ message: "Server error." });
  }
}

module.exports = { submitApplication, getUserApplications };