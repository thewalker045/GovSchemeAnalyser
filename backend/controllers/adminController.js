const pool = require("../config/db");

// GET /api/admin/applications
async function getAllApplications(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        a.application_id,
        a.applicant_name,
        a.phone,
        a.aadhaar_number,
        a.state,
        a.annual_income,
        a.status,
        a.submitted_on,
        a.next_step,

        u.full_name,
        u.email,

        s.scheme_name,
        s.category,
        s.ministry

      FROM applications a

      JOIN users u
      ON a.user_id = u.user_id

      JOIN schemes s
      ON a.scheme_id = s.scheme_id

      ORDER BY a.submitted_on DESC
    `);

    res.status(200).json(result.rows);

  } catch (err) {
    console.error(
      "Get all applications error:",
      err
    );

    res.status(500).json({
      message: "Server error.",
      error: err.message,
    });
  }
}

// PUT /api/admin/applications/:id/status
async function updateApplicationStatus(req, res) {
  const { id } = req.params;

  const {
    status,
    nextStep,
  } = req.body;

  try {
    await pool.query(
      `
      UPDATE applications

      SET
        status = $1,
        next_step = $2

      WHERE application_id = $3
      `,
      [status, nextStep, id]
    );

    res.status(200).json({
      message:
        "Status updated successfully.",
    });

  } catch (err) {
    console.error(
      "Update status error:",
      err
    );

    res.status(500).json({
      message: "Server error.",
      error: err.message,
    });
  }
}

// GET /api/admin/stats
async function getStats(req, res) {
  try {
    const totalSchemes = await pool.query(
      `SELECT COUNT(*) FROM schemes`
    );

    const totalApplications =
      await pool.query(
        `SELECT COUNT(*) FROM applications`
      );

    const approvedApplications =
      await pool.query(
        `
        SELECT COUNT(*)

        FROM applications

        WHERE status = 'Approved'
        `
      );

    const pendingApplications =
      await pool.query(
        `
        SELECT COUNT(*)

        FROM applications

        WHERE status = 'Submitted'
        `
      );

    res.status(200).json({
      totalSchemes: parseInt(
        totalSchemes.rows[0].count
      ),

      totalApplications: parseInt(
        totalApplications.rows[0].count
      ),

      approvedApplications: parseInt(
        approvedApplications.rows[0].count
      ),

      pendingApplications: parseInt(
        pendingApplications.rows[0].count
      ),
    });

  } catch (err) {
    console.error(
      "Get stats error:",
      err
    );

    res.status(500).json({
      message: "Server error.",
      error: err.message,
    });
  }
}

module.exports = {
  getAllApplications,
  updateApplicationStatus,
  getStats,
};