'use client';

import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function UpdateProfileSection() {
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  async function handleNameUpdate() {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const response = await fetch('/api/agents/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name: formData.fullName }),
      });
      const resJson = await response.json();
      if (response.ok) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error(resJson?.error || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  }
  const [formData, setFormData] = useState({
    fullName: '',
    agentId: '',
    email: '',
    isApproved: false,
    phone: '',
    id: '',
    name: '',
    role: '',
    approvalStatus: '',
    image: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from API and populate form
    async function fetchUserData() {
      setLoading(true);
      try {
        const response = await fetch('/api/agents/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for authentication
        });
        if (response.ok) {
          const data = (await response.json()).data;
          console.log('DATA', data);

          setFormData({
            fullName: data.name || '',
            agentId: data.id || '',
            email: data.email || '',
            isApproved: data.approvalStatus === 'APPROVED',
            id: data.id,
            name: data.name,
            role: data.role,
            approvalStatus: data.approvalStatus,
            image: data.image,
            phone: data.phone,
          });
          console.log(data);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="w-full space-y-8">
        <div className="flex-1 space-y-8">
          {/* Profile Photo Skeleton */}
          {/*
          <div className="flex flex-col items-center gap-3 pb-6 border-b border-gray-200">
            <div className="relative w-24 h-24">
              <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse flex items-center justify-center overflow-hidden" />
              <div className="absolute -bottom-1 right-2 h-7 w-7 rounded-full bg-gray-300 animate-pulse border-2 border-white" />
            </div>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          </div> */}
          {/* Basic Info Skeleton */}
          <div className="space-y-4">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="space-y-4">
              <div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="w-full h-10 bg-gray-200 rounded-xl animate-pulse" />
              </div>
              <div>
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="flex items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-2.5">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
          {/* Contact Info Skeleton */}
          <div className="space-y-4">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="w-full h-10 bg-gray-200 rounded-xl animate-pulse" />
          </div>
          {/* Action Buttons Skeleton */}
          <div className="flex justify-end gap-3 pt-6">
            <div className="rounded-full bg-gray-200 h-10 w-24 animate-pulse" />
            <div className="rounded-full bg-gray-200 h-10 w-24 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <div className="flex-1 space-y-8">
        {/* Profile Photo */}
        {/* <div className="flex flex-col items-center gap-3 pb-6 border-b border-gray-200">
          <div className="relative w-24 h-24">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {formData.image ? (
                <Image
                  src={formData.image}
                  alt="Profile"
                  className="w-24 h-24 object-cover rounded-full"
                />
              ) : (
                <svg
                  className="w-16 h-16 text-purple-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="12" fill="#E5E7EB" />
                  <path
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                    fill="#6B21A8"
                  />
                </svg>
              )}
            </div>
            <button className="absolute -bottom-1 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-teal-900 text-white shadow border-2 border-white">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <button className="text-xs font-medium text-teal-900 hover:text-teal-800">
            Edit photo
          </button>
        </div> */}
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Basic Info.</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  disabled={saving}
                />
                <button
                  className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${saveSuccess ? 'bg-green-600 text-white' : 'bg-teal-900 text-white hover:bg-teal-800'} disabled:opacity-60`}
                  onClick={handleNameUpdate}
                  disabled={saving || !formData.fullName.trim()}
                  type="button"
                >
                  {saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save'}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Agent ID (read-only)
              </label>
              <div className="flex items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-2.5">
                {/* Agent ID */}
                <span className="text-sm text-gray-700">
                  {formData.agentId}
                </span>
                {/* Status badge */}
                {formData.isApproved ? (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-green-700">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-600">
                      <Check className="h-3 w-3 text-white" />
                    </span>
                    Approved Agent
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-yellow-700">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400">
                      !
                    </span>
                    Pending Approval
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Contact Info */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Contact Info.</h2>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm bg-gray-100 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
