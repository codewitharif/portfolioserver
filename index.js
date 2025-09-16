const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Contact Form Route
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields required!" });
  }

  try {
    // Transporter setup
    const transporter = nodemailer.createTransport({
      service: "gmail", // ya "smtp" bhi use kar sakte ho
      auth: {
        user: process.env.EMAIL_USER, // tumhara gmail
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    // Mail options
    const mailOptions = {
      from: email,
      to: "mdarif1522003@gmail.com", // jahan email receive karna hai
      subject: `New Contact Form Submission from ${name} in Portfolio Website`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send message!" });
  }
});

//health check api
app.get("/", async (req, res) => {
  return res.json("portfolio server is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
