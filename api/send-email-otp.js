// Example backend API for sending OTP via Email
// This would be a separate Node.js/Express server file

const express = require('express');
const router = express.Router();

// Option 1: Using Nodemailer (Free with Gmail/SMTP)
const nodemailer = require('nodemailer');

// Option 2: Using SendGrid (Professional email service)
const sgMail = require('@sendgrid/mail');

// Option 3: Using Mailgun (Alternative email service)
const mailgun = require('mailgun-js');

router.post('/api/send-email-otp', async (req, res) => {
  try {
    const { email, otp, subject, message } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    // Option 1: Using Nodemailer with Gmail (Free for development)
    try {
      // Create transporter (use environment variables in production)
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER, // Your Gmail address
          pass: process.env.GMAIL_PASS  // Your Gmail app password
        }
      });

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
      console.log(`OTP sent to ${email}: ${otp}`);
      res.json({ success: true, message: 'OTP sent successfully to your email' });

    } catch (nodemailerError) {
      console.error('Nodemailer error:', nodemailerError);
      
      // Option 2: Using SendGrid (More reliable for production)
      try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        
        const msg = {
          to: email,
          from: 'noreply@zidansh.com',
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

        await sgMail.send(msg);
        console.log(`OTP sent to ${email}: ${otp}`);
        res.json({ success: true, message: 'OTP sent successfully to your email' });

      } catch (sendgridError) {
        console.error('SendGrid error:', sendgridError);
        
        // Option 3: Using Mailgun (Alternative)
        try {
          const DOMAIN = process.env.MAILGUN_DOMAIN;
          const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });

          const data = {
            from: 'Zidansh <noreply@zidansh.com>',
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

          await mg.messages().send(data);
          console.log(`OTP sent to ${email}: ${otp}`);
          res.json({ success: true, message: 'OTP sent successfully to your email' });

        } catch (mailgunError) {
          console.error('Mailgun error:', mailgunError);
          res.status(500).json({ success: false, message: 'Failed to send OTP email' });
        }
      }
    }

  } catch (error) {
    console.error('Send Email OTP error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Package.json dependencies needed:
// "nodemailer": "^6.9.0",
// "@sendgrid/mail": "^7.7.0",
// "mailgun-js": "^0.22.0"

// Environment variables needed:
// GMAIL_USER=your_gmail@gmail.com
// GMAIL_PASS=your_gmail_app_password
// SENDGRID_API_KEY=your_sendgrid_api_key
// MAILGUN_API_KEY=your_mailgun_api_key
// MAILGUN_DOMAIN=your_mailgun_domain

module.exports = router;
