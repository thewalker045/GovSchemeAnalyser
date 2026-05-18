const pool = require("../config/db");
const path = require("path");
const fs = require("fs");

// UPLOAD DOCUMENT
async function uploadDocument(req, res) {
  const { applicationId, documentName } = req.body;
  const userId = req.user.userId;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  if (!applicationId || !documentName) {
    return res.status(400).json({ message: "applicationId and documentName are required" });
  }

  try {
    // Verify the application exists
    const appCheck = await pool.query(
      `SELECT * FROM applications WHERE application_id = $1`,
      [applicationId]
    );

    if (appCheck.rows.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Build file URL (relative path served statically)
    const fileUrl = `/uploads/${req.file.filename}`;

    const result = await pool.query(
      `
      INSERT INTO application_documents
        (application_id, document_name, file_url, uploaded_at)
      VALUES
        ($1, $2, $3, NOW())
      RETURNING *
      `,
      [applicationId, documentName, fileUrl]
    );

    res.status(201).json({
      message: "Document uploaded successfully",
      document: result.rows[0],
    });

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// GET DOCUMENTS FOR AN APPLICATION
async function getDocuments(req, res) {
  const { applicationId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT *
      FROM application_documents
      WHERE application_id = $1
      ORDER BY uploaded_at DESC
      `,
      [applicationId]
    );

    res.status(200).json(result.rows);

  } catch (err) {
    console.error("Get documents error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// DELETE DOCUMENT
async function deleteDocument(req, res) {
  const { uploadId } = req.params;

  try {
    const docResult = await pool.query(
      `SELECT * FROM application_documents WHERE upload_id = $1`,
      [uploadId]
    );

    if (docResult.rows.length === 0) {
      return res.status(404).json({ message: "Document not found" });
    }

    const doc = docResult.rows[0];

    // Delete file from disk
    const filePath = path.join(__dirname, "..", doc.file_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await pool.query(
      `DELETE FROM application_documents WHERE upload_id = $1`,
      [uploadId]
    );

    res.status(200).json({ message: "Document deleted successfully" });

  } catch (err) {
    console.error("Delete document error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports = {
  uploadDocument,
  getDocuments,
  deleteDocument,
};
