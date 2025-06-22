const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ใช้ CORS ให้เสร็จทีเดียว
app.use(
  cors({
    origin: "https://devjourney-nine.vercel.app",
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// สำหรับ preflight OPTIONS (เพื่อความชัวร์)
app.options("/api/sendmail", cors());

// Nodemailer config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// API ส่งเมล
app.post("/api/sendmail", async (req, res) => {
  const { name, email, phone, type, budget, detail } = req.body;

  // Validate ฟิลด์เบื้องต้น (กัน empty spam)
  if (!detail || detail.trim().length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "กรุณากรอกข้อความ" });
  }

  const mailOptions = {
    from: `"No-Reply [เริ่มต้น Dev]" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_RECEIVER || "devj.contact@gmail.com",
    subject: `ติดต่องาน - ${name ? name : "ลูกค้าใหม่"}`,
    text: `
[แจ้งจากเว็บไซต์ เริ่มต้น Dev]
ชื่อ-นามสกุล: ${name || "-"}
อีเมล: ${email || "-"}
เบอร์ติดต่อ: ${phone || "-"}
ประเภทเว็บไซต์: ${type || "-"}
งบประมาณโดยประมาณ: ${budget || "-"}
รายละเอียดเพิ่มเติม: ${detail || "-"}
    `.trim(),
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "ส่งอีเมลเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("Mail error:", err); // <== log error ช่วย debug
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการส่งอีเมล",
      error: err.toString(),
    });
  }
});

// Railway/Vercel ต้องใช้ process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
