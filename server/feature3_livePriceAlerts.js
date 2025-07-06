// TradeNexus/Server/feature3_livePriceAlerts.js

const express = require("express");
const router = express.Router();
// Uncomment and configure nodemailer if you want to send real emails
// const nodemailer = require("nodemailer");

// Example POST /api/notify-alert
// Expects JSON: { symbol, price, levelType, levelValue, email (optional) }
router.post("/notify-alert", async (req, res) => {
  const { symbol, price, levelType, levelValue, email } = req.body;

  // Log the alert (for demo)
  console.log(
    `ALERT: ${symbol} at ₹${price} is near its ${levelType} (${levelValue})`
  );

  // If you want to send an email, uncomment and configure below:
  /*
  if (email) {
    try {
      // Configure your SMTP transporter
      const transporter = nodemailer.createTransport({
        service: "gmail", // or your email service
        auth: {
          user: process.env.ALERT_EMAIL_USER,
          pass: process.env.ALERT_EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.ALERT_EMAIL_USER,
        to: email,
        subject: `Price Alert: ${symbol} near ${levelType}`,
        text: `Stock ${symbol} is at ₹${price}, near its ${levelType} (${levelValue}).`,
      });

      return res.json({ status: "alert sent via email" });
    } catch (err) {
      console.error("Email send failed:", err.message);
      return res.status(500).json({ message: "Failed to send email alert" });
    }
  }
  */

  // Always respond with a success message for now
  res.json({ status: "alert logged" });
});

module.exports = router;
