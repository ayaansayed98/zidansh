import { useState } from 'react';
import { X } from 'lucide-react';
import { userService } from '../lib/database';
import { signInWithGoogle } from '../lib/auth';
import { hashPassword } from '../lib/crypto';
import { validateForm, FORM_SCHEMAS } from '../lib/validation';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUpClick: () => void;
}

export function SignInModal({ isOpen, onClose, onSignUpClick }: SignInModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [countdown, setCountdown] = useState(0);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    const validation = validateForm({ phone_number: phoneNumber, password }, FORM_SCHEMAS.signIn);
    if (!validation.isValid) {
      setError(Object.values(validation.errors)[0]);
      return;
    }

    try {
      setIsLoading(true);

      // Track signin attempt
      await userService.trackSigninAttempt({
        phone_number: phoneNumber,
        attempted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        ip_address: undefined, // Would need to get from request in real app
        user_agent: navigator.userAgent,
        session_id: localStorage.getItem('userSession') || undefined,
        success: false, // Will update if successful
        failure_reason: undefined
      });

      // Get user by phone number
      const user = await userService.getUserByPhone(phoneNumber);

      if (!user) {
        setError('Account not found. Please sign up first.');
        // Update tracking with failure
        await userService.trackSigninAttempt({
          phone_number: phoneNumber,
          attempted_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          success: false,
          failure_reason: 'Account not found'
        });
        return;
      }

      // Verify password
      if (!user.password_hash) {
        // User might have signed up with Google (no password)
        setError('Please sign in with Google');
        await userService.trackSigninAttempt({
          phone_number: phoneNumber,
          attempted_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          success: false,
          failure_reason: 'Password not set (Google user)'
        });
        return;
      }

      const inputHash = await hashPassword(password);
      if (inputHash !== user.password_hash) {
        setError('Invalid phone number or password. Please try again.');
        await userService.trackSigninAttempt({
          phone_number: phoneNumber,
          attempted_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          success: false,
          failure_reason: 'Invalid password'
        });
        return;
      }

      console.log('Signing in with:', { phoneNumber });

      // Update user signin info
      await userService.updateUserSignin(user.id);

      // Update tracking with success
      await userService.trackSigninAttempt({
        phone_number: phoneNumber,
        attempted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        success: true
      });


      // On successful sign in
      alert('Successfully signed in!');
      onClose();
    } catch (err) {
      setError('Invalid phone number or password. Please try again.');
      // Track failure
      await userService.trackSigninAttempt({
        phone_number: phoneNumber,
        attempted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        success: false,
        failure_reason: 'Invalid credentials'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    const validation = validateForm({ phone_number: phoneNumber, otp }, FORM_SCHEMAS.signInOtp);
    if (!validation.isValid) {
      setError(Object.values(validation.errors)[0]);
      return;
    }

    try {
      setIsLoading(true);

      // Track signin attempt
      await userService.trackSigninAttempt({
        phone_number: phoneNumber,
        attempted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        ip_address: undefined,
        user_agent: navigator.userAgent,
        session_id: localStorage.getItem('userSession') || undefined,
        success: false,
        failure_reason: undefined
      });

      // Get user by phone number
      const user = await userService.getUserByPhone(phoneNumber);

      if (!user) {
        setError('Account not found. Please sign up first.');
        await userService.trackSigninAttempt({
          phone_number: phoneNumber,
          attempted_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          success: false,
          failure_reason: 'Account not found'
        });
        return;
      }

      // In a real app, you would verify the OTP here
      // For demo purposes, we'll just simulate success
      console.log('Signing in with OTP:', { phoneNumber, otp });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update user signin info
      await userService.updateUserSignin(user.id);

      // Update tracking with success
      await userService.trackSigninAttempt({
        phone_number: phoneNumber,
        attempted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        success: true
      });

      // On successful sign in
      alert('Successfully signed in with OTP!');
      onClose();
    } catch (_err) {
      setError('Invalid OTP. Please try again.');
      await userService.trackSigninAttempt({
        phone_number: phoneNumber,
        attempted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        success: false,
        failure_reason: 'Invalid OTP'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async () => {
    setError('');

    if (!phoneNumber.match(/^[6-9]\d{9}$/)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      setIsLoading(true);
      // Simulate API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('OTP sent to', phoneNumber);
      startCountdown();
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startCountdown = () => {
    setCountdown(30);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resendOtp = () => {
    sendOtp();
  };

  const resetForm = () => {
    setPhoneNumber('');
    setPassword('');
    setOtp('');
    setError('');
    setLoginMode('password');
    setCountdown(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => {
            resetForm();
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600 text-sm mb-6">
            Sign in to your account to continue
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
              {error}
            </div>
          )}

          {loginMode === 'password' ? (
            <form onSubmit={handleSignIn}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      +91
                    </span>
                    <input
                      type="tel"
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-pink-500 focus:border-pink-500 text-black"
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs text-pink-600 hover:text-pink-700"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-black"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    className="text-xs text-pink-600 hover:text-pink-700"
                    onClick={() => {
                      // Handle forgot password
                      alert('Please contact support to reset your password.');
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 w-full flex justify-center py-2 px-4 border-2 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                style={{
                  minHeight: '44px',
                  backgroundColor: isLoading ? '#4B5563' : '#DB2777',
                  color: 'white',
                  borderColor: isLoading ? '#4B5563' : '#DB2777',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: 1
                }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSignIn}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="phone-otp" className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      +91
                    </span>
                    <input
                      type="tel"
                      id="phone-otp"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-pink-500 focus:border-pink-500 text-black"
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                    Enter OTP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-black"
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    required
                  />
                  <div className="mt-2 text-sm text-gray-500">
                    {countdown > 0 ? (
                      <span>Resend OTP in {countdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={resendOtp}
                        className="text-pink-600 hover:text-pink-700 font-medium"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 w-full flex justify-center py-2 px-4 border-2 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                style={{
                  minHeight: '44px',
                  backgroundColor: isLoading ? '#4B5563' : '#DB2777',
                  color: 'white',
                  borderColor: isLoading ? '#4B5563' : '#DB2777',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: 1
                }}
              >
                {isLoading ? 'Signing In...' : 'Sign In with OTP'}
              </button>
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                onClick={() => {
                  setLoginMode(loginMode === 'password' ? 'otp' : 'password');
                  setError('');
                  if (loginMode === 'password') {
                    sendOtp();
                  }
                }}
              >
                {loginMode === 'password' ? 'Login with OTP' : 'Login with Password'}
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    await signInWithGoogle();
                    // Don't set loading false here because page will redirect
                  } catch (error) {
                    console.error('Google sign in failed:', error);
                    setError('Failed to sign in with Google. Please try again.');
                    setIsLoading(false);
                  }
                }}
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-2" />
                {isLoading ? 'Redirecting...' : 'Sign in with Google'}
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onSignUpClick();
              }}
              className="text-sm text-gray-800 hover:text-pink-700 font-semibold"
            >
              Don't have an account? <span className="text-pink-600 font-bold hover:underline ml-1">Sign Up</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
