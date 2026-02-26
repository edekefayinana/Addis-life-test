'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/Logo';
export default function ResetPasswordPage() {
  const [step, setStep] = useState<'otp' | 'password'>('otp');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const email = useMemo(() => searchParams.get('email') || '', [searchParams]);
  const router = useRouter();

  // No need for useEffect to set email from searchParams; handled by useMemo above

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);
    const otpValue = Number(otp.join(''));
    if (!email || otp.join('').length !== 6 || isNaN(otpValue)) {
      setErrorMessage('Please enter the 6-digit OTP.');
      setIsSubmitting(false);
      return;
    }
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpValue, type: 'PASSWORD_RESET' }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.error || 'Verification failed.');
      } else {
        setSuccessMessage('OTP verified! Please set your new password.');
        setStep('password');
      }
    } catch {
      setErrorMessage('Verification failed.');
    }
    setIsSubmitting(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);
    if (!newPassword || !confirmPassword) {
      setErrorMessage('Please fill all fields.');
      setIsSubmitting(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setIsSubmitting(false);
      return;
    }
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otp.join(''), newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.error || 'Failed to reset password.');
      } else {
        setSuccessMessage('Password reset successfully! You can now log in.');
        setTimeout(() => {
          if (router) router.push('/login');
        }, 2000);
      }
    } catch {
      setErrorMessage('Failed to reset password.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <Logo />
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-semibold text-gray-900">Reset Password</h1>
        <p className="text-base text-gray-600 leading-relaxed">
          {step === 'otp'
            ? 'Enter the 6-digit code sent to your email.'
            : 'Set a new strong password to keep your account safe and secure.'}
        </p>
      </div>
      {step === 'otp' ? (
        <form className="space-y-6" onSubmit={handleOtpSubmit}>
          <div className="flex justify-center gap-3">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="h-16 w-16 rounded-lg text-center text-2xl font-medium shadow-none"
                  disabled={isSubmitting}
                />
              ))}
          </div>
          <Button
            type="submit"
            className="h-14 w-full rounded-full bg-primary text-base font-medium text-white hover:bg-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Verifying...' : 'Verify OTP'}
          </Button>
          {errorMessage && (
            <p className="text-sm text-red-600 text-center">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-sm text-green-600 text-center">
              {successMessage}
            </p>
          )}
        </form>
      ) : (
        <form className="space-y-6" onSubmit={handlePasswordSubmit}>
          <div className="space-y-2">
            <Label
              htmlFor="new-password"
              className="text-sm font-medium text-gray-900"
            >
              New Password
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="•••••3"
                className="h-14 rounded-lg pr-12 text-base"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="confirm-password"
              className="text-sm font-medium text-gray-900"
            >
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="•••••3"
                className="h-14 rounded-lg pr-12 text-base"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            className="h-14 w-full rounded-full bg-primary text-base font-medium text-white hover:bg-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </Button>
          {errorMessage && (
            <p className="text-sm text-red-600 text-center">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-sm text-green-600 text-center">
              {successMessage}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
