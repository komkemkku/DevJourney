const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config(); // << ต้องเพิ่มบรรทัดนี้

const app = express();

app.use(
  cors({
    origin: "*", // Dev phase, เปิดทุก origin
    methods: ["POST", "OPTIONS"],
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // ใช้จาก .env
    pass: process.env.EMAIL_PASS, // ใช้จาก .env
  },
});

app.post("/api/sendmail", async (req, res) => {
  const { name, email, phone, type, budget, detail } = req.body;
  const mailOptions = {
    from: `"No-Reply [ เริ่มต้น Dev ]" <${process.env.EMAIL_USER}>`,
    to: "devj.contact@gmail.com",
    subject: `ติดต่องาน - ${name ? name : "ลูกค้าใหม่"}`,
    text: `
[แจ้งจากเว็บไซต์ เริ่มต้น Dev]
ชื่อ-นามสกุล: ${name || "-"}
อีเมล: ${email || "-"}
เบอร์ติดต่อ: ${phone || "-"}
ประเภทเว็บไซต์: ${type || "-"}
งบประมาณโดยประมาณ: ${budget || "-"}
รายละเอียดเพิ่มเติม: ${detail || "-"}
    `,
  };
  try {
    let info = await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "ส่งอีเมลเรียบร้อยแล้ว" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการส่งอีเมล",
      error: err.toString(),
    });
  }
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
