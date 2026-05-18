const pool = require("../config/db");

// SUBMIT APPLICATION
async function submitApplication(req, res) {
  const { schemeId, income, applicantName, phone, aadhaar, state } = req.body;
  const userId = req.user.userId;

  try {
    const schemeResult = await pool.query(
      `SELECT * FROM schemes WHERE scheme_id = $1`,
      [schemeId]
    );

    if (schemeResult.rows.length === 0) {
      return res.status(404).json({ message: "Scheme not found" });
    }

    const result = await pool.query(
      `
      INSERT INTO applications
        (user_id, scheme_id, annual_income, status, next_step, submitted_on, applicant_name, phone, aadhaar_number, state)
      VALUES
        ($1, $2, $3, 'Submitted', 'Document verification pending', NOW(), $4, $5, $6, $7)
      RETURNING *
      `,
      [userId, schemeId, income, applicantName, phone, aadhaar, state]
    );

    res.status(201).json({
      message: "Application submitted successfully",
      application: result.rows[0],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// GET APPLICATIONS — only for the logged-in user
async function getUserApplications(req, res) {
  const userId = req.user.userId; // from JWT via verifyToken middleware

  try {
    const result = await pool.query(
      `
      SELECT
        a.*,
        s.scheme_name,
        s.category,
        s.ministry

      FROM applications a

      JOIN schemes s
      ON s.scheme_id = a.scheme_id

      WHERE a.user_id = $1

      ORDER BY a.submitted_on DESC
      `,
      [userId]
    );

    res.status(200).json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { submitApplication, getUserApplications };
