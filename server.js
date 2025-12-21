// Simple Email Server for Demo
// Run this with: node server.js

import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Create email transporter using Gmail (you'll need to set this up)
let transporter = null;

// Try to create transporter with environment variables
if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
  transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });
  console.log('✅ Email transporter configured with Gmail');
} else {
  console.log('⚠️  Email not configured. Set GMAIL_USER and GMAIL_PASS in .env file');
}

app.post('/api/send-email-otp', async (req, res) => {
  try {
    const { email, otp, subject } = req.body;
    
    if (!transporter) {
      // Fallback to demo mode if email not configured
      console.log('DEMO MODE - Email not configured');
      console.log(`DEMO OTP for ${email}: ${otp}`);
      return res.json({ 
        success: true, 
        message: 'Demo mode: Check console for OTP (Email not configured)',
        demo: true 
      });
    }
    
    const mailOptions = {
      from: `"Zidansh" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: subject || 'Zidansh - Email Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px;">Zidansh</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your Verification Code</p>
          </div>
          
          <div style="background: white; padding: 40px; text-align: center;">
            <div style="background: #f8f9fa; border-radius: 10px; padding: 20px; margin: 20px 0;">
              <h2 style="color: #333; margin: 0 0 10px 0; font-size: 24px;">Your OTP Code</h2>
              <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; margin: 20px 0;">
                ${otp}
              </div>
              <p style="color: #666; margin: 20px 0 0 0;">This code will expire in 10 minutes</p>
            </div>
            
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; text-align: left;">
              <p style="color: #856404; margin: 0;">
                <strong>Security Notice:</strong> Never share this code with anyone. Our team will never ask for your OTP.
              </p>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
            <p style="color: #666; margin: 0; font-size: 14px;">
              If you didn't request this code, please ignore this email.
            </p>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 12px;">
              © 2024 Zidansh. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP sent to ${email}: ${otp}`);
    res.json({ success: true, message: 'OTP sent successfully to your email', demo: false });
    
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email: ' + error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`📧 Email server running on port ${PORT}`);
  console.log(`📝 Setup instructions:`);
  console.log(`   1. Create .env file with:`);
  console.log(`      GMAIL_USER=your_gmail@gmail.com`);
  console.log(`      GMAIL_PASS=your_app_password`);
  console.log(`   2. Enable 2-Step Authentication in Gmail`);
  console.log(`   3. Generate App Password: https://myaccount.google.com/apppasswords`);
  console.log(`   4. Restart this server`);
  console.log(``);
  console.log(`🌐 Frontend should call: http://localhost:${PORT}/api/send-email-otp`);
});
