'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/Logo';

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-8">
      <Logo />

      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-semibold text-gray-900">
          Forget Password
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Enter your Email/ Phone Number, and we&apos;ll send you an OTP to
          reset your password.
        </p>
      </div>

      <form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-900">
            Email/ Phone Number
          </Label>
          <Input
            id="email"
            type="text"
            placeholder="+(251)-900-000-000"
            className="h-14 rounded-lg text-base"
          />
        </div>

        <Button
          type="submit"
          className="h-14 w-full rounded-full bg-primary text-base font-medium text-white hover:bg-primary/90"
        >
          Send OTP
        </Button>

        <div className="text-center text-base">
          <span className="text-gray-600">{"Don't have agent account? "}</span>
          <Link
            href="/signup"
            className="font-medium !text-blue-600 hover:text-blue-700 underline text-[18px]"
          >
            Apply for Access
          </Link>
        </div>
      </form>
    </div>
  );
}
