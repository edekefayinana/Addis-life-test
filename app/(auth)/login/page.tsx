'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/Logo';
import { Checkbox } from '@/components/ui/checkbox';
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      if (result.error.includes('verify your email')) {
        setErrorMessage(
          'Your email is not verified. Please check your inbox for the verification code.'
        );
      } else {
        setErrorMessage('Invalid email or password.');
      }
      return;
    }

    router.push('/admin');
  };

  return (
    <div className="space-y-8">
      <Logo />

      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-semibold text-gray-900">Agent Log In</h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Access your agent dashboard to manage property reservations and
          commissions.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-900">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="agent@example.com"
            className="h-14 rounded-lg text-base"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
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
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
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

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="keep-logged-in"
              checked={keepLoggedIn}
              onCheckedChange={(checked) => setKeepLoggedIn(checked as boolean)}
            />
            <Label
              htmlFor="keep-logged-in"
              className="text-base font-normal text-gray-600 cursor-pointer"
            >
              Keep me logged in
            </Label>
          </div>
          <Link
            href="/forgot-password"
            className="text-base font-normal text-gray-900 hover:text-gray-700"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          className="h-14 w-full rounded-full bg-primary text-base font-medium text-white hover:bg-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </Button>

        {errorMessage ? (
          <p className="text-sm text-red-600 text-center">{errorMessage}</p>
        ) : null}

        <div className="text-center text-sm">
          <span className="text-gray-600">
            {"Don't have an agent account? "}
          </span>
          <Link
            href="/signup"
            className="font-medium !text-blue-600 hover:text-blue-700 underline text-[18px]"
          >
            Apply for access
          </Link>
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full py-6 mt-4 border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            as="a"
            href="/"
          >
            <ChevronLeft className="h-4 w-4" />
            Go Back to Home
          </Button>
        </div>
      </form>
    </div>
  );
}
