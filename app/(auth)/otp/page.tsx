'use client';

import type React from 'react';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/Logo';
import { useTranslations } from 'next-intl';

export default function OtpVerificationPage() {
  const t = useTranslations('auth.otp');
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
      setErrorMessage(t('errors.emailNotFound'));
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
        setErrorMessage(data.error || t('errors.resendFailed'));
      } else {
        setSuccessMessage(t('success.resent'));
        // Clear OTP inputs
        setOtp(['', '', '', '', '', '']);
        // Focus first input
        document.getElementById('otp-0')?.focus();
      }
    } catch {
      setErrorMessage(t('errors.resendFailed'));
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
      setErrorMessage(t('errors.enterOtp'));
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
        setErrorMessage(data.error || t('errors.verificationFailed'));
      } else {
        setSuccessMessage(t('success.verified'));
        setVerified(true);
        setTimeout(() => {
          if (router) router.push('/login');
        }, 2000);
      }
    } catch {
      setErrorMessage(t('errors.verificationFailed'));
    }

    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <Logo />

      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-semibold text-gray-900">{t('title')}</h1>
        <p className="text-base text-gray-600 leading-relaxed">
          {t('subtitle')}
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
          <span className="text-gray-700">{t('didntGetOtp')} </span>
          <button
            type="button"
            onClick={handleResendOtp}
            className="font-medium text-gray-800 hover:text-black underline text-[18px]"
            disabled={verified || isResending}
          >
            {isResending ? t('resending') : t('resendOtp')}
          </button>
        </div>

        <Button
          type="submit"
          className="h-14 w-full rounded-full bg-primary text-base font-medium text-white hover:bg-primary/90"
          disabled={isSubmitting || verified}
        >
          {isSubmitting ? t('verifying') : t('verify')}
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
