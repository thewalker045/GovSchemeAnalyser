const express = require("express");
const multer = require("multer");
const path = require("path");

const pool = require("../config/db");

const router = express.Router();

// STORAGE CONFIG
const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() +
      "-" +
      file.originalname;

    cb(null, uniqueName);
  },
});

// FILE FILTER
const fileFilter = (
  req,
  file,
  cb
) => {

  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];

  if (
    allowedTypes.includes(file.mimetype)
  ) {

    cb(null, true);

  } else {

    cb(
      new Error(
        "Only PDF and image files allowed"
      ),
      false
    );
  }
};

// MULTER
const upload = multer({
  storage,
  fileFilter,
});

// UPLOAD ROUTE
router.post(
  "/upload-document/:applicationId",

  upload.single("document"),

  async (req, res) => {

    try {

      const { applicationId } =
        req.params;

      if (!req.file) {

        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      const documentName =
        req.file.originalname;

      const documentUrl =
        `uploads/${req.file.filename}`;

      // UPDATE APPLICATION
      const result =
        await pool.query(
          `
          UPDATE applications

          SET
            document_name = $1,
            document_url = $2

          WHERE application_id = $3

          RETURNING *
          `,
          [
            documentName,
            documentUrl,
            applicationId,
          ]
        );

      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({
          message:
            "Application not found",
        });
      }

      res.status(200).json({
        message:
          "Document uploaded successfully",

        application:
          result.rows[0],
      });

    } catch (err) {

      console.log(
        "Upload Error:",
        err
      );

      res.status(500).json({
        message: "Upload failed",
        error: err.message,
      });
    }
  }
);

module.exports = router;