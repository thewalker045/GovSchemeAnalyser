const pool = require("../config/db");
const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");

// Helper: check if uploaded file is a blank/invalid PDF
async function validatePdf(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(fileBuffer);

    // data.text is all extracted text across all pages
    const extractedText = data.text?.trim() ?? "";
    const pageCount = data.numpages ?? 0;

    // Blank if: no pages, or no extractable text at all
    if (pageCount === 0 || extractedText.length < 10) {
      return {
        valid: false,
        reason: "The uploaded PDF appears to be blank or contains no readable content.",
      };
    }

    return { valid: true };

  } catch (err) {
    // pdf-parse throws if the file is corrupt or not a real PDF
    return {
      valid: false,
      reason: "The uploaded file is not a valid PDF or is corrupted.",
    };
  }
}

// UPLOAD DOCUMENT
async function uploadDocument(req, res) {
  const { applicationId, documentName } = req.body;
  const userId = req.user.userId;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  if (!applicationId || !documentName) {
    // Clean up the file multer already saved
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ message: "applicationId and documentName are required." });
  }

  const filePath = req.file.path;

  try {
    // --- PDF VALIDATION ---
    const validation = await validatePdf(filePath);

    if (!validation.valid) {
      // Delete the rejected file from disk so it doesn't linger
      fs.unlinkSync(filePath);
      return res.status(422).json({ message: validation.reason });
    }

    // Verify the application exists and belongs to this user
    const appCheck = await pool.query(
      `SELECT * FROM applications WHERE application_id = $1`,
      [applicationId]
    );

    if (appCheck.rows.length === 0) {
      fs.unlinkSync(filePath);
      return res.status(404).json({ message: "Application not found." });
    }

    // Build relative URL for static serving
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
      message: "Document uploaded successfully.",
      document: result.rows[0],
    });

  } catch (err) {
    // If anything goes wrong after multer saved the file, clean it up
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.error("Upload error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
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
    res.status(500).json({ message: "Server error.", error: err.message });
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
      return res.status(404).json({ message: "Document not found." });
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

    res.status(200).json({ message: "Document deleted successfully." });

  } catch (err) {
    console.error("Delete document error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
}

module.exports = {
  uploadDocument,
  getDocuments,
  deleteDocument,
};
