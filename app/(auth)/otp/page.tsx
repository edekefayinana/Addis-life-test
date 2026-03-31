'use client';

import type React from 'react';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/Logo';

export default function OtpVerificationPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const searchParams = useSearchParams();
  const email = useMemo(() => searchParams.get('email') || '', [searchParams]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const router = useRouter();

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
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

  const handleResendOtp = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsResending(true);

    if (!email) {
      setErrorMessage('Email not found. Please register again.');
      setIsResending(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Failed to resend OTP.');
      } else {
        setSuccessMessage('OTP has been resent to your email.');
        // Clear OTP inputs
        setOtp(['', '', '', '', '', '']);
        // Focus first input
        document.getElementById('otp-0')?.focus();
      }
    } catch {
      setErrorMessage('Failed to resend OTP. Please try again.');
    }

    setIsResending(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    const otpValue = otp.join('');

    if (!email || otpValue.length !== 6) {
      setErrorMessage('Please enter the 6-digit OTP.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpValue }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Verification failed.');
      } else {
        setSuccessMessage('Email verified successfully! You can now log in.');
        setVerified(true);
        setTimeout(() => {
          if (router) router.push('/login');
        }, 2000);
      }
    } catch {
      setErrorMessage('Verification failed.');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <Logo />

      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-semibold text-gray-900">Enter OTP</h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Enter the 6-digit code sent to your email.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <Input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="h-16 w-16 rounded-lg text-center text-2xl font-medium shadow-none"
              disabled={verified}
            />
          ))}
        </div>

        <div className="text-center text-base">
          <span className="text-gray-700">{"Didn't get OTP? "}</span>
          <button
            type="button"
            onClick={handleResendOtp}
            className="font-medium text-gray-800 hover:text-black underline text-[18px]"
            disabled={verified || isResending}
          >
            {isResending ? 'Resending...' : 'Resend OTP'}
          </button>
        </div>

        <Button
          type="submit"
          className="h-14 w-full rounded-full bg-primary text-base font-medium text-white hover:bg-primary/90"
          disabled={isSubmitting || verified}
        >
          {isSubmitting ? 'Verifying...' : 'Verify'}
        </Button>

        {errorMessage && (
          <p className="text-sm text-red-600 text-center">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-sm text-green-600 text-center">{successMessage}</p>
        )}
      </form>
    </div>
  );
}
