const express = require("express");
app.options("/api/sendmail", cors());
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS
app.use(
  cors({
    origin: "https://devjourney-nine.vercel.app", // ไม่มี '/' ท้าย
    methods: ["POST", "OPTIONS"],
  })
);

// *** เพิ่มบรรทัดนี้ ***
app.options("/api/sendmail", cors()); // สำหรับ preflight

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/api/sendmail", async (req, res) => {
  const { name, email, phone, type, budget, detail } = req.body;
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
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการส่งอีเมล",
      error: err.toString(),
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
