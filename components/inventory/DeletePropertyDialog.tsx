'use client';

import { useState } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface DeletePropertyDialogProps {
  propertyId: string;
  propertyTitle: string;
  onDeleted?: () => void;
  disabled?: boolean;
}

export function DeletePropertyDialog({
  propertyId,
  propertyTitle,
  onDeleted,
  disabled = false,
}: DeletePropertyDialogProps) {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isAdmin } = useAuth();

  // Don't render if user is not admin
  if (!isAdmin) {
    return null;
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/inventory/${propertyId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete property');
      }

      toast.success('Property deleted successfully');
      setShowModal(false);
      onDeleted?.();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete property'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (showModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Delete Property</h2>
            </div>
            <button
              onClick={() => setShowModal(false)}
              disabled={isDeleting}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete{' '}
              <strong>&quot;{propertyTitle}&quot;</strong>?
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-red-800 mb-2">
                This action will permanently delete:
              </h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• The property listing</li>
                <li>• All property images</li>
                <li>• All amenities and nearby places</li>
                <li>• All reservation history</li>
              </ul>
              <p className="text-sm font-medium text-red-800 mt-3">
                This action cannot be undone.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? 'Deleting...' : 'Delete Property'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={disabled}
      onClick={() => setShowModal(true)}
      className="h-8 w-8 p-0 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
      title="Delete Property"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
