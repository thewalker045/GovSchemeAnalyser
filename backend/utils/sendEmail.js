const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOtpEmail(toEmail, otp, purpose) {
  const subject =
    purpose === "register"
      ? "GovConnect - Verify Your Registration"
      : "GovConnect - Login OTP";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;
      padding: 30px; background: #0b1020; color: #fff; border-radius: 12px;">
      <h2 style="color: #22d3ee;">GovConnect</h2>
      <p style="color: #9ca3af;">
        Your OTP for ${purpose === "register" ? "registration" : "login"} is:
      </p>
      <div style="font-size: 36px; font-weight: bold; letter-spacing: 10px;
        color: #a855f7; margin: 20px 0;">
        ${otp}
      </div>
      <p style="color: #9ca3af;">
        This OTP is valid for <strong style="color:#fff">10 minutes</strong>.
      </p>
      <p style="color: #9ca3af;">
        If you did not request this, please ignore this email.
      </p>
      <hr style="border-color: #1f2937; margin: 20px 0;">
      <p style="color: #6b7280; font-size: 12px;">
        Government of India Initiative • Secure Digital Access
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"GovConnect" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject,
    html,
  });
}

module.exports = sendOtpEmail;