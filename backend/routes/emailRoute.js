// routes/emailRoutes.js
import express from 'express';
import nodemailer from 'nodemailer';
const router = express.Router();

const transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
   user: process.env.EMAIL_USER,
   pass: process.env.APP_PASSWORD // Gmail App Password
 }
});

router.post('/send-email', async (req, res) => {
 const { to, subject, html } = req.body;

 try {
   await transporter.sendMail({
     from: process.env.EMAIL_USER,
     to,
     subject,
     html
   });
   res.status(200).json({ success: true, message: 'Email sent successfully' });
 } catch (error) {
   res.status(500).json({ success: false, message: error.message });
 }
});

export default router;