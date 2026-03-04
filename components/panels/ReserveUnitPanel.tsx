/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ReserveUnitPanelProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  onReservationSuccess?: () => void;
}

export default function ReserveUnitPanel({
  isOpen,
  onClose,
  propertyId,
  // onReservationSuccess,
}: ReserveUnitPanelProps) {
  const [loading, setLoading] = useState(false);
  // Removed unused setError and variable assignment
  const [success, setSuccess] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (user) {
      setClientName(user.name || '');
      setEmail(user.email || '');
      // Try to fetch phone from user object, fallback to empty string
      setPhone((user as any).phone || '');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;
  return (
    // return the panel
    <div
      className="fixed inset-0 bg-black/50 flex items-stretch justify-end z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-[360px] sm:w-[420px] h-screen bg-white border-l flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Reserve this Unit</h2>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 p-1 rounded"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Client Name *
            </label>
            <Input placeholder="Biruk Solomon" value={clientName} disabled />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email *
            </label>
            <Input
              type="email"
              placeholder="Example1@gmail.com"
              value={email}
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Phone Number *
            </label>
            <Input placeholder="(+251)-911-201096" value={phone} disabled />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Description
            </label>
            <Textarea
              placeholder="Write Your questions in detail..."
              className="min-h-32"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-white">
          <Button
            className="w-full bg-teal-900 hover:bg-teal-800 text-white py-3 h-auto text-base rounded-full"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              setSuccess(false);
              try {
                const res = await fetch('/api/reservations', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    propertyId,
                    description: description || undefined,
                  }),
                });
                if (!res.ok) {
                  const data = await res.json();
                  console.log(data.data.error);

                  toast.error(data.data.error || 'Reservation failed');
                  throw new Error(data.data.error || 'Reservation failed');
                }
                toast.success('Reservation successful!');
                setSuccess(true);
                setTimeout(() => {
                  setSuccess(false);
                  onClose();
                }, 1200);
              } catch {
                // Error is handled by toast, no need to setError
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? 'Reserving...' : success ? 'Reserved!' : 'Reserve'}
          </Button>
          {/* Error and success messages are now handled by Sonner toast */}
        </div>
      </div>
    </div>
  );
}
