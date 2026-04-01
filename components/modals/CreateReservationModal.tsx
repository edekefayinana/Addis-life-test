'use client';

import { useState, useRef, useEffect } from 'react';
import { X, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from 'next-auth/react';

interface CreateReservationModalProps {
  propertyId: string;
  propertyTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateReservationModal({
  propertyId,
  propertyTitle,
  onClose,
  onSuccess,
}: CreateReservationModalProps) {
  const { data: session } = useSession();

  // Client Information - Pre-fill with user data if available
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientGovIdFile, setClientGovIdFile] = useState<File | null>(null);
  const [existingGovIdUrl, setExistingGovIdUrl] = useState<string | null>(null);

  // Payment Information
  const [reservationAmount, setReservationAmount] = useState('');
  const [bankSlipFile, setBankSlipFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

  const govIdInputRef = useRef<HTMLInputElement | null>(null);
  const bankSlipInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch user data and pre-fill form
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.email) {
        setIsLoadingUserData(false);
        return;
      }

      try {
        const response = await fetch('/api/agents/profile');
        if (response.ok) {
          const data = await response.json();
          const userData = data.data;

          // Pre-fill form with user data
          if (userData.name) setClientName(userData.name);
          if (userData.phone) setClientPhone(userData.phone);
          if (userData.email) setClientEmail(userData.email);

          // Check if user has government ID from registration
          if (userData.governmentIdUrl) {
            setExistingGovIdUrl(userData.governmentIdUrl);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoadingUserData(false);
      }
    };

    fetchUserData();
  }, [session]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'govId' | 'bankSlip'
  ) => {
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

      if (type === 'govId') {
        setClientGovIdFile(file);
        setExistingGovIdUrl(null); // Clear existing URL when new file is selected
      } else {
        setBankSlipFile(file);
      }
      setErrorMessage('');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    // Validation
    if (!clientName.trim() || !clientPhone.trim()) {
      setErrorMessage('Client name and phone are required.');
      setIsSubmitting(false);
      return;
    }

    // Check if we have government ID (either existing or newly uploaded)
    if (!clientGovIdFile && !existingGovIdUrl) {
      setErrorMessage('Client government ID is required.');
      setIsSubmitting(false);
      return;
    }

    if (!reservationAmount || parseFloat(reservationAmount) <= 0) {
      setErrorMessage('Valid reservation amount is required.');
      setIsSubmitting(false);
      return;
    }

    if (!bankSlipFile) {
      setErrorMessage('Bank slip/payment proof is required.');
      setIsSubmitting(false);
      return;
    }

    try {
      let clientGovernmentId = existingGovIdUrl;

      // Upload client government ID only if a new file was selected
      if (clientGovIdFile) {
        const govIdFormData = new FormData();
        govIdFormData.append('file', clientGovIdFile);
        govIdFormData.append('type', 'government_id');

        const govIdResponse = await fetch('/api/upload/reservation-documents', {
          method: 'POST',
          body: govIdFormData,
        });

        if (!govIdResponse.ok) {
          setErrorMessage('Failed to upload client government ID.');
          setIsSubmitting(false);
          return;
        }

        const { url } = await govIdResponse.json();
        clientGovernmentId = url;
      }

      // Upload bank slip
      const bankSlipFormData = new FormData();
      bankSlipFormData.append('file', bankSlipFile);
      bankSlipFormData.append('type', 'bank_slip');

      const bankSlipResponse = await fetch(
        '/api/upload/reservation-documents',
        {
          method: 'POST',
          body: bankSlipFormData,
        }
      );

      if (!bankSlipResponse.ok) {
        setErrorMessage('Failed to upload bank slip.');
        setIsSubmitting(false);
        return;
      }

      const { url: bankSlipUrl } = await bankSlipResponse.json();

      // Create reservation
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          clientName,
          clientPhone,
          clientEmail: clientEmail || null,
          clientGovernmentId,
          reservationAmount: parseFloat(reservationAmount),
          bankSlipUrl,
          description: description || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Failed to create reservation.');
        setIsSubmitting(false);
        return;
      }

      // Success
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Reservation error:', error);
      setErrorMessage('Network error. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Create Reservation
            </h2>
            <p className="text-sm text-gray-600 mt-1">{propertyTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 p-2 rounded-full"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading State */}
        {isLoadingUserData ? (
          <div className="p-6 space-y-6">
            {/* Client Information Skeleton */}
            <div className="space-y-4">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Payment Information Skeleton */}
            <div className="space-y-4">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Client Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                Client Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">
                    Client Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="clientName"
                    type="text"
                    placeholder="John Doe"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientPhone">
                    Client Phone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="clientPhone"
                    type="tel"
                    placeholder="+251-900-000-000"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientEmail">Client Email (Optional)</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  placeholder="client@example.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Client Government ID <span className="text-red-500">*</span>
                </Label>

                {existingGovIdUrl && !clientGovIdFile && (
                  <div className="mb-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 mb-2">
                      ✓ Using your registered government ID
                    </p>
                    <a
                      href={existingGovIdUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 underline"
                    >
                      View Document
                    </a>
                    <p className="text-xs text-gray-600 mt-1">
                      You can upload a different document if needed
                    </p>
                  </div>
                )}

                <div
                  onClick={() => govIdInputRef.current?.click()}
                  className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition hover:border-gray-400"
                >
                  <div className="flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <UploadCloud className="h-6 w-6 text-gray-600" />
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-700">
                    {clientGovIdFile
                      ? clientGovIdFile.name
                      : existingGovIdUrl
                        ? 'Click to upload a different document'
                        : 'Click to upload'}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    PDF, JPG, or PNG (max 5MB)
                  </p>
                  <input
                    ref={govIdInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'govId')}
                  />
                </div>
              </div>
            </div>

            {/* Payment Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                Payment Information
              </h3>

              <div className="space-y-2">
                <Label htmlFor="reservationAmount">
                  Reservation Amount (ETB){' '}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="reservationAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="10000.00"
                  value={reservationAmount}
                  onChange={(e) => setReservationAmount(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Bank Slip / Payment Proof{' '}
                  <span className="text-red-500">*</span>
                </Label>
                <div
                  onClick={() => bankSlipInputRef.current?.click()}
                  className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition hover:border-gray-400"
                >
                  <div className="flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <UploadCloud className="h-6 w-6 text-gray-600" />
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-700">
                    {bankSlipFile ? bankSlipFile.name : 'Click to upload'}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    PDF, JPG, or PNG (max 5MB)
                  </p>
                  <input
                    ref={bankSlipInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'bankSlip')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Additional Notes (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Any additional information..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-700 text-center">
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Reservation'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
