'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/Logo';

export default function ApplyPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  return (
    <div className="space-y-8">
      <Logo />

      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-semibold text-gray-900">
          Apply as an Agent
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Submit your details to apply for access to the agent portal. All
          applications are reviewed before approval.
        </p>
      </div>

      <form className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="first-name"
              className="text-sm font-medium text-gray-900"
            >
              First Name
            </Label>
            <Input
              id="first-name"
              type="text"
              placeholder="Biruk"
              className="h-14 rounded-lg text-base"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="last-name"
              className="text-sm font-medium text-gray-900"
            >
              Last Name
            </Label>
            <Input
              id="last-name"
              type="text"
              placeholder="Solomon"
              className="h-14 rounded-lg text-base"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-900">
            Phone Number <span className="text-gray-500">(required)</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+(251)-900-000-000"
            className="h-14 rounded-lg text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-900">
            Email{' '}
            <span className="text-gray-500">(optional but recommended)</span>
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="Example1@gmail.com"
              className="h-14 rounded-lg pr-12 text-base"
            />
            <button
              type="button"
              onClick={() => setShowEmail(!showEmail)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showEmail ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-gray-900"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="•••••3"
              className="h-14 rounded-lg pr-12 text-base"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
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
        >
          Submit for Application
        </Button>

        <div className="text-center text-base">
          <span className="text-gray-600">Already have agent account? </span>
          <Link
            href="/login"
            className="font-medium !text-blue-600 hover:text-blue-700 underline text-[18px]"
          >
            Log In
          </Link>
        </div>
      </form>
    </div>
  );
}
