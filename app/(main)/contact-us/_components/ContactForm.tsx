'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  description: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  description?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    description: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Your message is sent successfully.');

        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          description: '',
        });
        setErrors({});
      } else {
        if (result.errors) {
          // Handle validation errors from server
          const serverErrors: FormErrors = {};
          result.errors.forEach((error: { field: string; message: string }) => {
            serverErrors[error.field as keyof FormErrors] = error.message;
          });
          setErrors(serverErrors);
          toast.error('Please fix the errors in the form');
        } else {
          toast.error(
            result.message || 'Failed to send message. Please try again.'
          );
        }
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-[#F6F8FA] w-full p-4 lg:p-8 shadow-none rounded-xl md:rounded-3xl">
      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-6">
        {/* First Name and Last Name Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-3 flex flex-col">
            <Label htmlFor="firstName" className="text-base font-medium">
              First Name *
            </Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Eg, Biruk"
              className={`h-14 px-6 py-4 rounded-xl shadow-none border ${
                errors.firstName ? 'border-red-500 focus:border-red-500' : ''
              }`}
            />
            {errors.firstName && (
              <span className="text-sm text-red-500">{errors.firstName}</span>
            )}
          </div>
          <div className="space-y-3 flex flex-col">
            <Label htmlFor="lastName" className="text-base font-medium">
              Last Name *
            </Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Eg, Solomon"
              className={`h-14 px-6 py-4 rounded-xl shadow-none border ${
                errors.lastName ? 'border-red-500 focus:border-red-500' : ''
              }`}
            />
            {errors.lastName && (
              <span className="text-sm text-red-500">{errors.lastName}</span>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-3 flex flex-col">
          <Label htmlFor="email" className="text-base font-medium">
            Email *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Example1@gmail.com"
            className={`h-14 px-6 py-4 rounded-xl shadow-none ${
              errors.email ? 'border-red-500 focus:border-red-500' : ''
            }`}
          />
          {errors.email && (
            <span className="text-sm text-red-500">{errors.email}</span>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-3 flex flex-col">
          <Label htmlFor="phone" className="text-base font-medium">
            Phone Number *
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="(+251)-911-201096"
            className={`h-14 px-6 py-4 rounded-xl shadow-none ${
              errors.phone ? 'border-red-500 focus:border-red-500' : ''
            }`}
          />
          {errors.phone && (
            <span className="text-sm text-red-500">{errors.phone}</span>
          )}
        </div>

        {/* Description */}
        <div className="space-y-3 flex flex-col">
          <Label htmlFor="description" className="text-base font-medium">
            Description *
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Write Your questions in detail..."
            className={`min-h-[140px] px-7 py-4 rounded-xl shadow-none ${
              errors.description ? 'border-red-500 focus:border-red-500' : ''
            }`}
          />
          {errors.description && (
            <span className="text-sm text-red-500">{errors.description}</span>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 lg:h-14 w-full rounded-full bg-primary text-base mt-4 lg:mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Send A message'}
        </Button>
      </form>
    </Card>
  );
}
