// Example backend API for sending OTP via SMS
// This would be a separate Node.js/Express server file

const express = require('express');
const router = express.Router();

// Example using Twilio (popular SMS service)
const twilio = require('twilio');
const client = twilio('YOUR_ACCOUNT_SID', 'YOUR_AUTH_TOKEN');

// Alternative using MessageBird
// const messagebird = require('messagebird')(YOUR_API_KEY);

// Alternative using Fast2SMS (India-specific)
// const axios = require('axios');

router.post('/api/send-otp', async (req, res) => {
  try {
    const { mobile, otp, message } = req.body;

    // Validate mobile number
    if (!mobile || mobile.length !== 10) {
      return res.status(400).json({ success: false, message: 'Invalid mobile number' });
    }

    // Option 1: Using Twilio (International)
    try {
      await client.messages.create({
        body: message,
        from: '+1234567890', // Your Twilio phone number
        to: `+91${mobile}` // Indian mobile number with country code
      });
      
      console.log(`OTP sent to ${mobile}: ${otp}`);
      res.json({ success: true, message: 'OTP sent successfully' });
    } catch (twilioError) {
      console.error('Twilio error:', twilioError);
      
      // Option 2: Using Fast2SMS (India - cheaper alternative)
      try {
        const response = await axios.post('https://www.fast2sms.com/dev/bulkV2', {
          authorization: 'YOUR_FAST2SMS_API_KEY',
          route: 'v3',
          sender_id: 'FTWSMS',
          message: message,
          numbers: mobile,
          flash: '0'
        });
        
        if (response.data.return === true) {
          console.log(`OTP sent to ${mobile}: ${otp}`);
          res.json({ success: true, message: 'OTP sent successfully' });
        } else {
          throw new Error('Fast2SMS failed');
        }
      } catch (fast2Error) {
        console.error('Fast2SMS error:', fast2Error);
        
        // Option 3: Using MessageBird (Alternative)
        try {
          await messagebird.messages.create({
            originator: 'YourBrand',
            recipients: [`+91${mobile}`],
            body: message
          });
          
          console.log(`OTP sent to ${mobile}: ${otp}`);
          res.json({ success: true, message: 'OTP sent successfully' });
        } catch (messageBirdError) {
          console.error('MessageBird error:', messageBirdError);
          res.status(500).json({ success: false, message: 'Failed to send OTP' });
        }
      }
    }

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Package.json dependencies needed:
// "twilio": "^4.0.0",
// "messagebird": "^3.0.0",
// "axios": "^1.0.0"

// Environment variables needed:
// TWILIO_ACCOUNT_SID=your_account_sid
// TWILIO_AUTH_TOKEN=your_auth_token
// FAST2SMS_API_KEY=your_fast2sms_key
// MESSAGEBIRD_API_KEY=your_messagebird_key
