const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// POST /api/auth/register
async function register(req, res) {
  const { fullName, email, phone, aadhaar, state, password } = req.body;

  try {
    const existing = await pool.query(
      "SELECT user_id FROM users WHERE email = $1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user as already verified — no OTP needed
    const result = await pool.query(
      `INSERT INTO users
        (full_name, email, phone, aadhaar_number, state, password_hash, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, true)
       RETURNING user_id, full_name, email, state, role`,
      [fullName, email, phone, aadhaar, state, passwordHash]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      { userId: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Registration successful.",
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
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration." });
  }
}

// POST /api/auth/login
async function login(req, res) {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Issue JWT directly — no OTP step
    const token = jwt.sign(
      { userId: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful.",
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
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login." });
  }
}

module.exports = { register, login };
