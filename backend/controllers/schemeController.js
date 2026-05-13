const pool = require("../config/db");

async function getSchemes(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        s.scheme_id,
        s.scheme_name,
        s.ministry,
        s.category,
        s.benefit_description,
        s.income_limit,
        s.processing_days,
        s.deadline,
        s.is_active,

        COALESCE(
          json_agg(sd.document_name)
          FILTER (WHERE sd.document_name IS NOT NULL),
          '[]'
        ) AS documents

      FROM schemes s

      LEFT JOIN scheme_documents sd
        ON s.scheme_id = sd.scheme_id

      GROUP BY
        s.scheme_id,
        s.scheme_name,
        s.ministry,
        s.category,
        s.benefit_description,
        s.income_limit,
        s.processing_days,
        s.deadline,
        s.is_active

      ORDER BY s.scheme_id
    `);

    res.status(200).json(result.rows);

  } catch (err) {
    console.error("Get schemes error:", err);

    res.status(500).json({
      message: "Server error.",
    });
  }
}

module.exports = {
  getSchemes,
};