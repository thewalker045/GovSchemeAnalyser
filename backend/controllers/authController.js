const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateOtp = require("../utils/generateOtp");
const sendOtpEmail = require("../utils/sendEmail");
require("dotenv").config();

// POST /api/auth/register
async function register(req, res) {
  const { fullName, email, phone, aadhaar, state, password } = req.body;

  try {
    // Check if email already exists
    const existing = await pool.query(
      "SELECT user_id FROM users WHERE email = $1",
      [email]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user as unverified
    await pool.query(
      `INSERT INTO users 
        (full_name, email, phone, aadhaar_number, state, password_hash, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, false)`,
      [fullName, email, phone, aadhaar, state, passwordHash]
    );

    // Generate OTP
    const otp = generateOtp();

    // Store OTP
    await pool.query(
      `INSERT INTO otp_verifications (email, otp_code, purpose, expires_at)
       VALUES ($1, $2, 'register', NOW() + INTERVAL '10 minutes')`,
      [email, otp]
    );

    // Send OTP email
    await sendOtpEmail(email, otp, "register");

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration." });
  }
}

// POST /api/auth/login
async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Find user
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const user = result.rows[0];

    // Check verified
    if (!user.is_verified) {
      return res.status(403).json({ message: "Please verify your email first." });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generate OTP
    const otp = generateOtp();

    // Store OTP
    await pool.query(
      `INSERT INTO otp_verifications (email, otp_code, purpose, expires_at)
       VALUES ($1, $2, 'login', NOW() + INTERVAL '10 minutes')`,
      [email, otp]
    );

    // Send OTP email
    await sendOtpEmail(email, otp, "login");

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login." });
  }
}

// POST /api/auth/verify-otp
async function verifyOtp(req, res) {
  const { email, otp, purpose } = req.body;

  try {
    // Validate OTP
    const result = await pool.query(
      `SELECT otp_id FROM otp_verifications
       WHERE email = $1
         AND otp_code = $2
         AND purpose = $3
         AND is_used = false
         AND expires_at > NOW()`,
      [email, otp, purpose]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    const otpId = result.rows[0].otp_id;

    // Mark OTP used
    await pool.query(
      "UPDATE otp_verifications SET is_used = true WHERE otp_id = $1",
      [otpId]
    );

    // If registering, mark user verified
    if (purpose === "register") {
      await pool.query(
        "UPDATE users SET is_verified = true WHERE email = $1",
        [email]
      );
    }

    // Get user details
    const userResult = await pool.query(
      "SELECT user_id, full_name, email, state, role FROM users WHERE email = $1",
      [email]
    );
    const user = userResult.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { userId: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "OTP verified successfully.",
      token,
      user: {
        userId: user.user_id,
        fullName: user.full_name,
        email: user.email,
        state: user.state,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "Server error during OTP verification." });
  }
}

// POST /api/auth/resend-otp
async function resendOtp(req, res) {
  const { email, purpose } = req.body;

  try {
    // Expire old OTPs
    await pool.query(
      `UPDATE otp_verifications SET is_used = true
       WHERE email = $1 AND purpose = $2 AND is_used = false`,
      [email, purpose]
    );

    // Generate new OTP
    const otp = generateOtp();

    await pool.query(
      `INSERT INTO otp_verifications (email, otp_code, purpose, expires_at)
       VALUES ($1, $2, $3, NOW() + INTERVAL '10 minutes')`,
      [email, otp, purpose]
    );

    await sendOtpEmail(email, otp, purpose);

    res.status(200).json({ message: "OTP resent successfully." });
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ message: "Server error during OTP resend." });
  }
}

module.exports = { register, login, verifyOtp, resendOtp };