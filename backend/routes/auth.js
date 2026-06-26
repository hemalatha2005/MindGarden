const express = require("express");
const nodemailer = require("nodemailer");
const { signPayload } = require("../middleware/auth");

const router = express.Router();
const otpStore = new Map();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_TTL_MS = 5 * 60 * 1000;

const createOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const getTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

router.post("/request-otp", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: "Enter a valid email address." });
    }

    const transporter = getTransporter();
    if (!transporter) {
      return res.status(500).json({
        error: "Email OTP is not configured. Add SMTP settings in backend/.env.",
      });
    }

    const otp = createOtp();
    const expiresAt = Date.now() + OTP_TTL_MS;
    otpStore.set(email, {
      otp,
      expiresAt,
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Your MindGarden OTP",
      text: `Your MindGarden OTP is ${otp}. It expires in 5 minutes.`,
      html: `<p>Your MindGarden OTP is <strong>${otp}</strong>.</p><p>It expires in 5 minutes.</p>`,
    });

    res.json({ success: true, message: "OTP sent.", expiresAt: new Date(expiresAt).toISOString() });
  } catch (error) {
    console.error("OTP send failed:", error.message);
    res.status(500).json({ error: "Failed to send OTP. Check your email settings." });
  }
});

router.post("/verify-otp", (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const otp = String(req.body.otp || "").trim();
  const saved = otpStore.get(email);

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }

  if (!saved || Date.now() > saved.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ error: "OTP expired. Please request a new one." });
  }

  if (saved.otp !== otp) {
    return res.status(400).json({ error: "That OTP is incorrect." });
  }

  otpStore.delete(email);

  const token = signPayload({
    email,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    token,
    email,
  });
});

module.exports = router;
