const pool = require("../config/db");

// POST /api/applications
async function submitApplication(req, res) {
  const {
    schemeId,
    income,
    applicantName,
    phone,
    aadhaar,
    state,
  } = req.body;

  const userId = req.user.userId;

  try {
    // Check scheme exists
    const schemeResult = await pool.query(
      `SELECT * FROM schemes WHERE scheme_id = $1`,
      [schemeId]
    );

    if (schemeResult.rows.length === 0) {
      return res.status(404).json({
        message: "Scheme not found",
      });
    }

    const scheme = schemeResult.rows[0];

    // Eligibility check
    if (Number(income) > Number(scheme.income_limit)) {
      return res.status(400).json({
        message:
          "Not eligible. Income exceeds scheme limit.",
      });
    }

    // Insert application
    const result = await pool.query(
      `
      INSERT INTO applications
      (
        user_id,
        scheme_id,
        applicant_name,
        phone,
        aadhaar_number,
        state,
        annual_income,
        status,
        next_step,
        submitted_on
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        'Submitted',
        'Document verification pending',
        NOW()
      )
      RETURNING application_id
      `,
      [
        userId,
        schemeId,
        applicantName,
        phone,
        aadhaar,
        state,
        income,
      ]
    );

    res.status(201).json({
      message: "Application submitted successfully",
      applicationId:
        result.rows[0].application_id,
    });

  } catch (err) {
    console.error("Submit application error:", err);

    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
}

// GET user applications
async function getUserApplications(req, res) {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `
      SELECT
        a.application_id,
        a.user_id,
        a.scheme_id,
        a.applicant_name,
        a.phone,
        a.aadhaar_number,
        a.state,
        a.annual_income,
        a.status,
        a.next_step,
        a.submitted_on,
        a.reviewed_by,
        a.reviewed_at,

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
    console.error("Get applications error:", err);

    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
}

module.exports = {
  submitApplication,
  getUserApplications,
};