const pool = require("../config/db");

// GET /api/schemes
async function getSchemes(req, res) {
  try {
    const result = await pool.query("SELECT * FROM schemes ORDER BY scheme_id");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Get schemes error:", err);
    res.status(500).json({ message: "Server error." });
  }
}

module.exports = { getSchemes };