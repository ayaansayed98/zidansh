# SMS OTP Setup Guide

## Current Status
The OTP system currently works in **demo mode only**:
- OTP is generated and shown in browser console
- OTP is displayed in an alert for testing
- No actual SMS is sent to mobile numbers

## To Send Real SMS to Mobile Numbers

### Option 1: Twilio (International, Reliable)
**Cost:** ~₹1-2 per SMS
**Setup Time:** 10 minutes

1. **Sign up for Twilio:**
   - Go to https://www.twilio.com/
   - Create a free account
   - Get your Account SID and Auth Token

2. **Install Twilio:**
   ```bash
   npm install twilio
   ```

3. **Update environment variables:**
   ```env
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

4. **Uncomment the Twilio code in `src/contexts/AuthContext.tsx`**

### Option 2: Fast2SMS (India, Cheaper)
**Cost:** ~₹0.20-0.50 per SMS  
**Setup Time:** 5 minutes

1. **Sign up for Fast2SMS:**
   - Go to https://www.fast2sms.com/
   - Get your API key

2. **Install axios:**
   ```bash
   npm install axios
   ```

3. **Update environment variables:**
   ```env
   FAST2SMS_API_KEY=your_api_key
   ```

### Option 3: MessageBird (Alternative)
**Cost:** ~₹1-2 per SMS
**Setup Time:** 10 minutes

1. **Sign up for MessageBird:**
   - Go to https://www.messagebird.com/
   - Get your API key

2. **Install MessageBird:**
   ```bash
   npm install messagebird
   ```

## Quick Setup Steps

### Step 1: Choose Your SMS Provider
Pick one of the options above based on your budget and requirements.

### Step 2: Get API Credentials
Sign up and get your API keys/credentials.

### Step 3: Install Dependencies
```bash
# For Twilio
npm install twilio

# For Fast2SMS  
npm install axios

# For MessageBird
npm install messagebird
```

### Step 4: Update Code
1. Uncomment the production code in `src/contexts/AuthContext.tsx`
2. Replace the demo SMS sending with your chosen service
3. Add your API credentials to environment variables

### Step 5: Test
1. Enter a real mobile number
2. Click "Send OTP"
3. Check if SMS is received

## Environment Variables Setup
Create a `.env` file in your project root:

```env
# Twilio (if using)
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Fast2SMS (if using)
FAST2SMS_API_KEY=your_api_key

# MessageBird (if using)
MESSAGEBIRD_API_KEY=your_api_key
```

## Production Deployment Notes

1. **Security:** Never commit API keys to Git
2. **Rate Limiting:** Implement rate limiting to prevent abuse
3. **Error Handling:** Handle failed SMS deliveries gracefully
4. **Cost Monitoring:** Monitor SMS costs and set up alerts
5. **OTP Expiry:** Set OTP expiry time (recommended: 10 minutes)

## Testing Without Real SMS

For development/testing without real SMS:

1. **Current Demo Mode:** OTP shows in console and alert
2. **Email Alternative:** Send OTP via email instead of SMS
3. **Test Numbers:** Use specific test numbers provided by SMS services

## Legal Compliance

- Follow TRAI regulations for SMS in India
- Include your business registration details
- Provide opt-out option
- Maintain DND (Do Not Disturb) compliance

## Support

If you need help setting up real SMS:
1. Check the SMS provider's documentation
2. Ensure your mobile number format is correct (+91XXXXXXXXXX)
3. Verify API credentials are correct
4. Check if your account has sufficient balance

---

**Current Demo Behavior:**
- OTP is generated and stored in browser
- OTP is shown in console: `DEMO OTP for 9876543210 : 123456`
- OTP is shown in alert popup
- No real SMS is sent

**After Setup:**
- Real SMS will be sent to the mobile number
- User will receive actual OTP via SMS
- Demo console/alert will be removed
