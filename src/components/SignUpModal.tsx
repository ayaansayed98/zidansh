import { useState } from 'react';
import { X } from 'lucide-react';
import { userService } from '../lib/database';
import { validateForm, FORM_SCHEMAS } from '../lib/validation';
import { signInWithGoogle } from '../lib/auth';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInClick: () => void;
}

import { hashPassword } from '../lib/crypto';

export function SignUpModal({ isOpen, onClose, onSignInClick }: SignUpModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);


  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!phoneNumber.match(/^[6-9]\d{9}$/)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      setIsLoading(true);
      // Simulate API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, you would make an API call to send the OTP
      console.log('OTP sent to', phoneNumber);

      // Move to OTP verification step
      setStep(2);
      startCountdown();
    } catch (_err) {
      setError('Failed to send OTP. Please try again.');
      console.error('Error sending OTP:', _err);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp.match(/^\d{6}$/)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setIsLoading(true);
      // In a real app, you would verify the OTP with your backend
      console.log('Verifying OTP:', otp);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, any 6-digit OTP is considered valid
      setStep(3);
    } catch (_err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation using the new validation system
    const formData = { username, phone_number: phoneNumber, password, confirmPassword };
    const validation = validateForm(formData, FORM_SCHEMAS.signUp);

    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setError(firstError);
      return;
    }

    try {
      setIsLoading(true);

      // Hash the password
      const hashedPassword = await hashPassword(password);

      // Create user account
      const newUser = {
        username: username.trim(),
        phone_number: phoneNumber,
        password_hash: hashedPassword
      };

      await userService.create(newUser);

      // On successful signup
      alert('Account created successfully! You can now sign in.');
      onClose();
      onSignInClick();
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err.message?.includes('duplicate key')) {
        setError('Username or phone number already exists. Please try a different one.');
      } else {
        setError('Failed to create account. Please try again.');
      }
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
    // In a real app, you would resend the OTP
    console.log('Resending OTP to', phoneNumber);
    startCountdown();
  };

  const resetForm = () => {
    setStep(1);
    setPhoneNumber('');
    setOtp('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError('');
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create an Account</h2>
          <p className="text-gray-600 text-sm mb-6">
            {step === 1 && 'Enter your mobile number to get started'}
            {step === 2 && `Enter the OTP sent to +91 ${phoneNumber}`}
            {step === 3 && 'Complete your profile'}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
              {error}
            </div>
          )}

          {/* Step 1: Phone Number */}
          {step === 1 && (
            <form onSubmit={handleSendOtp}>
              <div className="mb-4">
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
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border-2 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                style={{
                  minHeight: '44px',
                  backgroundColor: isLoading ? '#4B5563' : '#DB2777',
                  color: 'white',
                  borderColor: isLoading ? '#4B5563' : '#DB2777',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: 1
                }}
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          )}

          {/* Step 2: Verify OTP */}
          {step === 2 && (
            <form onSubmit={verifyOtp}>
              <div className="mb-4">
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
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border-2 border-pink-600 rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-gray-500 disabled:text-white disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
          )}

          {/* Step 3: Create Account */}
          {step === 3 && (
            <form onSubmit={handleSignUp}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-black"
                    placeholder="Choose a username"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-black"
                    placeholder="Create a password (min 6 characters)"
                    minLength={6}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-black"
                    placeholder="Confirm your password"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 w-full flex justify-center py-2 px-4 border-2 border-pink-600 rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-gray-500 disabled:text-white disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
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

            <div className="mt-6">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    await signInWithGoogle();
                    // Don't set loading false here because page will redirect
                  } catch (error) {
                    console.error('Google sign up failed:', error);
                    setError('Failed to sign up with Google. Please try again.');
                    setIsLoading(false);
                  }
                }}
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-2" />
                {isLoading ? 'Redirecting...' : 'Sign up with Google'}
              </button>
            </div>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onSignInClick();
              }}
              className="text-sm text-gray-600 hover:text-pink-600"
            >
              Already have an account? <span className="font-medium text-pink-600 hover:text-pink-500">Sign In</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
