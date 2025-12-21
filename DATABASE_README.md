# Database Setup for Sign Up and Sign In Forms

This guide explains how to set up the database for the user authentication system.

## Prerequisites

- A Supabase account (free tier available at [supabase.com](https://supabase.com))
- Node.js and npm installed
- Your React/Vite project set up

## Database Setup Steps

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in your project details:
   - Name: Your project name
   - Database Password: Choose a strong password
   - Region: Select the closest region to your users
4. Wait for the project to be created (usually takes 2-3 minutes)

### 2. Set Up the Database Tables

1. In your Supabase dashboard, go to the "SQL Editor" tab
2. Copy the entire contents of `database_setup.sql`
3. Paste it into the SQL Editor
4. Click "Run" to execute the script

This will create:
- `users` table for storing user accounts
- `signin_tracking` table for tracking login attempts
- `order_tracking_requests` table for order tracking (if needed)
- All necessary indexes and security policies

### 3. Configure Environment Variables

1. In your Supabase dashboard, go to "Settings" → "API"
2. Copy your project URL and anon key
3. Create a `.env` file in your project root (copy from `.env.example`):

```bash
cp .env.example .env
```

4. Fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Test the Database Connection

1. Start your development server:

```bash
npm run dev
```

2. Try signing up a new user through your sign-up form
3. Check your Supabase dashboard → "Table Editor" to see if the user was created
4. Try signing in with the created account

## Database Schema

### Users Table
- `id`: Primary key (auto-increment)
- `username`: Unique username
- `phone_number`: Unique phone number (10 digits)
- `password_hash`: Hashed password
- `email_address`: Optional email
- `is_verified`: Verification status
- `otp_code`: Current OTP code
- `otp_expires_at`: OTP expiration time
- `last_signin_at`: Last successful sign-in
- `signin_count`: Number of successful sign-ins
- `status`: Account status (active/suspended/banned)
- `created_at`: Account creation time
- `updated_at`: Last update time

### Sign-in Tracking Table
- `id`: Primary key
- `phone_number`: Phone number used for sign-in attempt
- `attempted_at`: Timestamp of attempt
- `ip_address`: IP address of the attempt
- `user_agent`: Browser/device info
- `session_id`: Session identifier
- `success`: Whether the attempt was successful
- `failure_reason`: Reason for failure (if applicable)

## Security Features

- **Row Level Security (RLS)**: Enabled on all tables
- **Password Hashing**: Uses SHA-256 hashing (upgrade to bcrypt in production)
- **OTP Verification**: 6-digit OTP with 10-minute expiration
- **Sign-in Tracking**: Logs all authentication attempts
- **Account Status**: Can suspend or ban accounts

## API Usage

The database is accessed through the `userService` in `src/lib/database.ts`:

```typescript
import { userService } from '../lib/database';

// Create a new user
const newUser = await userService.createUser({
  username: 'johndoe',
  phone_number: '9876543210',
  password_hash: hashedPassword
});

// Get user by phone number
const user = await userService.getUserByPhone('9876543210');

// Track sign-in attempt
await userService.trackSigninAttempt({
  phone_number: '9876543210',
  success: true,
  user_agent: navigator.userAgent
});
```

## Production Considerations

1. **Password Hashing**: Use bcrypt or Argon2 instead of SHA-256
2. **Rate Limiting**: Implement rate limiting for sign-in attempts
3. **Email Verification**: Add email verification for accounts
4. **Session Management**: Implement proper session handling
5. **Backup**: Set up automated database backups
6. **Monitoring**: Monitor failed sign-in attempts for security

## Troubleshooting

### Common Issues

1. **"Table doesn't exist" error**:
   - Make sure you ran the `database_setup.sql` script in Supabase

2. **"RLS policy violation" error**:
   - Check that RLS policies are correctly set up
   - Ensure you're using the correct authentication context

3. **Connection refused**:
   - Verify your `.env` file has correct Supabase credentials
   - Check that your Supabase project is active

4. **CORS errors**:
   - Supabase handles CORS automatically, but check your domain settings

### Getting Help

- Check Supabase documentation: [docs.supabase.com](https://docs.supabase.com)
- Review the SQL scripts in this project for reference
- Check browser console and Supabase logs for detailed error messages

## Next Steps

After setting up the database:
1. Test user registration and sign-in flows
2. Implement password reset functionality
3. Add email verification
4. Set up monitoring and alerts for suspicious activity
5. Consider implementing 2FA for enhanced security
