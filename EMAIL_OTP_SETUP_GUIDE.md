# Email OTP Setup Guide

## Current Status
The OTP system currently works in **demo mode only**:
- OTP is generated and shown in browser console
- OTP is displayed in an alert for testing
- No actual email is sent to the email address

## To Send Real OTP to Email Addresses

### Option 1: Nodemailer with Gmail (Free - Best for Development)
**Cost:** Free
**Setup Time:** 15 minutes
**Best for:** Development, small projects

#### Step 1: Set up Gmail App Password
1. Go to your Google Account: https://myaccount.google.com/
2. Enable 2-Step Authentication (if not already enabled)
3. Go to Security → App Passwords
4. Generate a new app password for "Mail"
5. Copy the 16-character password

#### Step 2: Install Nodemailer
```bash
npm install nodemailer
```

#### Step 3: Set up Environment Variables
Create a `.env` file:
```env
GMAIL_USER=your_gmail@gmail.com
GMAIL_PASS=your_16_character_app_password
```

#### Step 4: Update Code
Uncomment the production code in `src/contexts/AuthContext.tsx`

### Option 2: SendGrid (Professional - Best for Production)
**Cost:** Free tier (100 emails/day), then ~$0.30/100 emails
**Setup Time:** 10 minutes
**Best for:** Production applications

#### Step 1: Create SendGrid Account
1. Go to https://signup.sendgrid.com/
2. Sign up for free account
3. Verify your email address
4. Create an API key

#### Step 2: Install SendGrid
```bash
npm install @sendgrid/mail
```

#### Step 3: Set up Environment Variables
```env
SENDGRID_API_KEY=your_sendgrid_api_key
```

#### Step 4: Update Code
Uncomment the SendGrid section in `api/send-email-otp.js`

### Option 3: Mailgun (Alternative Professional)
**Cost:** Free tier (5,000 emails/month), then ~$0.80/1000 emails
**Setup Time:** 15 minutes
**Best for:** High-volume applications

#### Step 1: Create Mailgun Account
1. Go to https://www.mailgun.com/
2. Sign up for free account
3. Verify your domain
4. Get your API key and domain

#### Step 2: Install Mailgun
```bash
npm install mailgun-js
```

#### Step 3: Set up Environment Variables
```env
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain
```

## Quick Setup (Recommended: Gmail + Nodemailer)

### Step 1: Install Dependencies
```bash
npm install nodemailer
```

### Step 2: Set up Gmail App Password
1. Enable 2-Step Authentication in your Google Account
2. Generate App Password for Mail
3. Copy the password

### Step 3: Create Environment File
Create `.env` in project root:
```env
GMAIL_USER=your_gmail@gmail.com
GMAIL_PASS=your_16_character_app_password
```

### Step 4: Create Backend Server
Create `server.js`:
```javascript
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

app.post('/api/send-email-otp', async (req, res) => {
  try {
    const { email, otp, subject } = req.body;
    
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
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}: ${otp}`);
    res.json({ success: true, message: 'OTP sent successfully' });
    
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Email server running on port ${PORT}`);
});
```

### Step 5: Install Additional Dependencies
```bash
npm install express cors dotenv
```

### Step 6: Start Backend Server
```bash
node server.js
```

### Step 7: Update Frontend
Uncomment the production code in `src/contexts/AuthContext.tsx`

## Testing Real Email OTP

1. **Start your backend server** (`node server.js`)
2. **Enter a real email address** in the sign-up form
3. **Click "Send OTP"**
4. **Check your email inbox** for the OTP
5. **Enter the OTP** in the form
6. **Complete registration**

## Email Template Features

The email template includes:
- **Professional design** with Zidansh branding
- **Large, clear OTP code** with spacing
- **Security notice** about not sharing the code
- **Expiration warning** (10 minutes)
- **Responsive design** for mobile devices
- **Branded header** and footer

## Production Considerations

### Security
- Use environment variables for credentials
- Never commit API keys to Git
- Implement rate limiting for OTP requests
- Add email validation and sanitization

### Deliverability
- Set up SPF/DKIM records for your domain
- Use professional email services for production
- Monitor email bounce rates
- Handle spam complaints

### Performance
- Use email queue for high volume
- Implement caching for OTP verification
- Add retry logic for failed emails
- Monitor email sending metrics

## Troubleshooting

### Gmail Issues
- **"Less secure apps" error**: Use App Password, not regular password
- **"Authentication failed"**: Check 2-Step Authentication is enabled
- **"Daily limit exceeded"**: Gmail has daily sending limits

### General Issues
- **Email not received**: Check spam folder
- **API errors**: Verify environment variables
- **CORS issues**: Ensure backend allows frontend origin

---

## Current Demo vs Production

**Current Demo:**
- OTP shows in console: `DEMO OTP for user@email.com : 123456`
- OTP shows in alert popup
- No real email sent

**After Setup:**
- Real HTML email sent to user's inbox
- Professional email template with branding
- OTP expires after 10 minutes
- Email delivery tracking and error handling

Choose the option that best fits your needs and follow the setup instructions!
