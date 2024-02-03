const express = require("express");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const cors = require("cors")

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Middleware to log all requests
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    next(); // Pass control to the next middleware or route handler
});


app.get("/", (req, res) => {
  res.send("API is working fine");
});

app.post("/api/message", async (req, res) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  console.log(req.body.email);

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: req.body.email,
    subject: "Wintana Apartments - Message Received",
    html: `<div style="font-family: 'Arial', sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px;">
            <h2 style="color: #333; margin-bottom: 20px;">Wintana Apartments</h2>
            <p style="font-size: 16px; color: #555; line-height: 1.5; margin-bottom: 20px;">
                Dear Guest,
            </p>
            <p style="font-size: 16px; color: #555; line-height: 1.5; margin-bottom: 20px;">
                Thank you for reaching out to Wintana Apartments! Your message has been successfully received by our dedicated manager. We appreciate your interest in our apartment services and will get back to you shortly with further details and confirmation.
            </p>
            <p style="font-size: 16px; color: #555; line-height: 1.5;">
                If you have any immediate questions or concerns, you can also reach out to us directly. We look forward to assisting you and making your stay with Wintana Apartments a pleasant and memorable experience!
            </p>
            <p style="font-size: 16px; color: #555; line-height: 1.5; margin-top: 20px;">
                Best regards,<br>
                Wintana Apartments Team
            </p>
        </div>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.log("Error while sending email:", error);
    res.status(400).json({ status: "failure" });
  }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
