'use client';

import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';

export default function ApplyAsAgentPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [governmentIdFile, setGovernmentIdFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
      ];
      if (!validTypes.includes(file.type)) {
        setErrorMessage('Please upload a PDF, JPG, or PNG file.');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('File size must be less than 5MB.');
        return;
      }
      setGovernmentIdFile(file);
      setErrorMessage('');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    // Client-side validation
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('Please enter both first and last name.');
      setIsSubmitting(false);
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Email address is required.');
      setIsSubmitting(false);
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Password is required.');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      setIsSubmitting(false);
      return;
    }

    if (!governmentIdFile) {
      setErrorMessage('Government ID is required.');
      setIsSubmitting(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }

    const name = `${firstName} ${lastName}`.trim();

    try {
      // First, upload the government ID
      const formData = new FormData();
      formData.append('file', governmentIdFile);
      formData.append('folder', 'government_ids');

      const uploadResponse = await fetch('/api/upload/government-id', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        setErrorMessage('Failed to upload Government ID. Please try again.');
        setIsSubmitting(false);
        return;
      }

      const { url: governmentIdUrl } = await uploadResponse.json();

      // Then, register the user with the uploaded file URL
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          governmentIdUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(
          data.error || 'Unable to create account. Please try again.'
        );
        setIsSubmitting(false);
        return;
      }

      // Success - redirect to OTP page
      router.push(`/otp?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage(
        'Network error. Please check your connection and try again.'
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <Logo />

      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-semibold text-gray-900">
          Apply as an Agent
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Submit your details to apply for access to the agent portal.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
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
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
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
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-900">
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+(251)-900-000-000"
            className="h-14 rounded-lg text-base"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-900">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Example1@gmail.com"
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

        <div className="space-y-2">
          <Label className="text-base font-medium text-gray-700">
            Government ID (Passport/ID) <span className="text-red-500">*</span>
          </Label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer mt-2 rounded-xl border border-gray-700 bg-gray-50 p-8 text-center transition hover:border-gray-800"
          >
            <div className="flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                  <UploadCloud className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </div>
            <p className="mt-2 text-sm font-medium text-gray-700">
              {governmentIdFile ? governmentIdFile.name : 'Click to upload'}{' '}
              {!governmentIdFile && (
                <span className="text-gray-500">or drag and drop</span>
              )}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              PDF, JPG, or PNG (max 5MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="h-14 w-full rounded-full bg-primary text-base font-medium text-white hover:bg-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating account...' : 'Submit Application'}
        </Button>

        {errorMessage && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-700 text-center">{errorMessage}</p>
          </div>
        )}

        <div className="text-center text-base">
          <span className="text-gray-600">Already have agent account? </span>
          <Link
            href="/login"
            className="font-medium text-blue-600! hover:text-blue-700 underline text-[18px]"
          >
            Log In
          </Link>
        </div>
      </form>
    </div>
  );
}
