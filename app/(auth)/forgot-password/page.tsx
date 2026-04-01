'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/Logo';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ForgotPasswordPage() {
  const t = useTranslations('auth.forgotPassword');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.error || t('errors.sendFailed'));
      } else {
        setSuccessMessage(t('success.otpSent'));
        setTimeout(() => {
          if (router)
            router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        }, 1500);
      }
    } catch {
      setErrorMessage(t('errors.sendFailed'));
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
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-900">
            {t('email')}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={t('emailPlaceholder')}
            className="h-14 rounded-lg text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <Button
          type="submit"
          className="h-14 w-full rounded-full bg-primary text-base font-medium text-white hover:bg-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? t('sending') : t('sendOtp')}
        </Button>

        {errorMessage && (
          <p className="text-sm text-red-600 text-center">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-sm text-green-600 text-center">{successMessage}</p>
        )}

        <div className="text-center text-base">
          <span className="text-gray-600">{t('dontHaveAccount')} </span>
          <Link
            href="/apply"
            className="font-medium text-blue-600 hover:text-blue-700 underline text-[18px]"
          >
            {t('applyForAccess')}
          </Link>
        </div>
      </form>
    </div>
  );
}
