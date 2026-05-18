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

        u.user_id,
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
    console.error("Get all applications error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
}

// GET /api/admin/applications/:id
async function getApplicationById(req, res) {
  const { id } = req.params;

  try {
    const appResult = await pool.query(
      `
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

        u.user_id,
        u.full_name,
        u.email,

        s.scheme_name,
        s.category,
        s.ministry,
        s.benefit_description,
        s.income_limit,
        s.deadline,
        s.processing_days

      FROM applications a

      JOIN users u
      ON a.user_id = u.user_id

      JOIN schemes s
      ON a.scheme_id = s.scheme_id

      WHERE a.application_id = $1
      `,
      [id]
    );

    if (appResult.rows.length === 0) {
      return res.status(404).json({ message: "Application not found." });
    }

    const docsResult = await pool.query(
      `
      SELECT
        upload_id,
        document_name,
        file_url,
        uploaded_at

      FROM application_documents

      WHERE application_id = $1

      ORDER BY uploaded_at ASC
      `,
      [id]
    );

    res.status(200).json({
      application: appResult.rows[0],
      documents: docsResult.rows,
    });

  } catch (err) {
    console.error("Get application by id error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
}

// PUT /api/admin/applications/:id/status
async function updateApplicationStatus(req, res) {
  const { id } = req.params;
  const { status, nextStep } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE applications
      SET
        status = $1,
        next_step = $2
      WHERE application_id = $3
      RETURNING application_id, status, next_step
      `,
      [status, nextStep, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Application not found." });
    }

    res.status(200).json({
      message: "Status updated successfully.",
      updated: result.rows[0],
    });

  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
}

// GET /api/admin/stats
async function getStats(req, res) {
  try {
    const totalSchemes = await pool.query(`SELECT COUNT(*) FROM schemes`);

    const totalApplications = await pool.query(
      `SELECT COUNT(*) FROM applications`
    );

    const approvedApplications = await pool.query(
      `SELECT COUNT(*) FROM applications WHERE status = 'Approved'`
    );

    const pendingApplications = await pool.query(
      `SELECT COUNT(*) FROM applications WHERE status = 'Pending'`
    );

    res.status(200).json({
      totalSchemes: parseInt(totalSchemes.rows[0].count),
      totalApplications: parseInt(totalApplications.rows[0].count),
      approvedApplications: parseInt(approvedApplications.rows[0].count),
      pendingApplications: parseInt(pendingApplications.rows[0].count),
    });

  } catch (err) {
    console.error("Get stats error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
}

module.exports = {
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  getStats,
};
