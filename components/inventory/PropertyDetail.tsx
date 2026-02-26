'use client';

import { useState } from 'react';
import {
  ChevronLeft,
  Share2,
  Heart,
  Plus,
  Download,
  MapPin,
  Check,
} from 'lucide-react';
import ReserveUnitPanel from '@/components/panels/ReserveUnitPanel';
import Image from 'next/image';

interface PropertyDetailProps {
  // propertyId: string
  onBack: () => void;
}

export function PropertyDetail({ onBack }: PropertyDetailProps) {
  const [selectedTab, setSelectedTab] = useState<
    'overview' | 'video' | 'virtual'
  >('overview');
  const [showReservePanel, setShowReservePanel] = useState(false);

  const property = {
    name: 'Vatican site - Three Bedroom Apartment',
    beds: 3,
    baths: 2,
    sqft: 450,
    price: 'ETB 3,300,000',
    location: 'Vatican Site',
    description:
      'This three-bedroom apartment for sale in Ethiopia offers a spacious and thoughtfully designed living environment, perfect for families or individuals seeking comfort and style. The adaptable floor plan allows for flexible use of space, including the option to create a home office or add extra storage. Residents also enjoy 107.03 sq.ft of dents also enjoy 107.03 sq.ft of common area (including terrace), a 12.00 sq.ft parking',
  };

  const images = [
    '/luxury-apartment-exterior-building.jpg',
    '/modern-living-room.png',
    '/kitchen-with-stainless-steel-appliances.jpg',
    '/master-bedroom-with-city-view.jpg',
  ];

  const propertyDetails = [
    { label: 'Total Bed Room', value: "3+maid's" },
    { label: 'Total Bathroom', value: '2 Bathroom' },
    { label: 'Kitchen', value: 'Modern kitchen' },
    { label: 'Parking Space', value: '1' },
    { label: 'Finishing', value: 'Semi-Finished' },
    { label: 'Area Size', value: '218.43 M²' },
    { label: 'Building Size', value: '28 + G + 24 + Roof' },
    { label: 'Available Floors', value: '13, 14, 15' },
    { label: 'Delivery Time', value: 'After 6 month (June 2026)' },
  ];

  const amenities = [
    'Lift',
    'Garbage Shoot',
    'Parking Space',
    'Green area',
    'Terrace',
    'Under ground water',
  ];

  const surroundings = [
    'Vatican Embassy & Canada Embassy',
    'IOS International School',
    'Church and Mosque',
  ];

  const documents = [
    { name: 'Project Brochure', icon: '📄' },
    { name: 'Materials & Finishes Spec Sheet', icon: '📄' },
  ];

  return (
    <div className="w-full">
      <div className="bg-gray-100 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-white border-b border-gray-200">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <ChevronLeft size={24} />
            <span>Back</span>
          </button>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Share2 size={20} />
              Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Heart size={20} />
              Save
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Property Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {property.name}
          </h1>

          <div className="flex gap-4 mb-6 text-gray-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                🛏️ {property.beds} Beds
              </span>
              <span className="flex items-center gap-1">
                🚿 {property.baths} Baths
              </span>
              <span className="flex items-center gap-1">
                📐 {property.sqft} sqft
              </span>
            </div>
          </div>

          {/* Images Grid */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="col-span-2 row-span-2">
              <Image
                src={images[0] || '/placeholder.svg?height=400&width=500'}
                alt="Main view"
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
            {images.slice(1, 4).map((image, idx) => (
              <Image
                key={idx}
                src={image || '/placeholder.svg?height=200&width=250'}
                alt={`View ${idx + 2}`}
                className="w-full h-[11.5rem] object-cover rounded-lg"
              />
            ))}
            <button className="col-span-1 bg-black text-white rounded-lg flex items-center justify-center font-semibold hover:bg-gray-800">
              +6
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="col-span-2">
              {/* Tabs */}
              <div className="flex gap-8 mb-8 border-b border-gray-300">
                {(['overview', 'video', 'virtual'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`py-4 px-2 font-medium capitalize ${
                      selectedTab === tab
                        ? 'text-orange-500 border-b-2 border-orange-500'
                        : 'text-gray-600'
                    }`}
                  >
                    {tab === 'video'
                      ? '📹 Video Tour'
                      : tab === 'virtual'
                        ? '🎮 Virtual Tour'
                        : '📋 Overview'}
                  </button>
                ))}
              </div>

              {/* Overview Content */}
              {selectedTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Overview
                  </h2>
                  <p className="text-gray-700 mb-8 leading-relaxed">
                    {property.description}
                  </p>

                  <button className="text-teal-900 font-semibold flex items-center gap-2 mb-8">
                    <span>Show more</span>
                    <Plus size={16} />
                  </button>

                  {/* Property Details Section */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 mt-12">
                    Property Details
                  </h3>
                  <div className="grid grid-cols-2 gap-6 mb-12">
                    {propertyDetails.map((detail, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between pb-4 border-b border-gray-200"
                      >
                        <span className="text-gray-600">{detail.label}</span>
                        <span className="font-semibold text-gray-900">
                          {detail.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Amenities Section */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Amenities
                  </h3>
                  <div className="grid grid-cols-3 gap-4 mb-12">
                    {amenities.map((amenity, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg"
                      >
                        <Check size={20} className="text-orange-500" />
                        <span className="text-gray-900 font-medium">
                          {amenity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Location & Surroundings Section */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Location & Surroundings
                  </h3>
                  <p className="text-gray-700 mb-6">
                    Located minutes from supermarkets, highways, schools, and
                    clinics, this property guarantees both privacy and
                    accessibility. A growing area with increasing residential
                    value.
                  </p>
                  <div className="space-y-3 mb-12">
                    {surroundings.map((location, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <Check size={20} className="text-orange-500" />
                        <span className="text-gray-900">{location}</span>
                      </div>
                    ))}
                  </div>

                  {/* Location Map Section */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Location
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin size={20} className="text-orange-500" />
                    <span className="text-gray-900 font-medium">
                      Wereda 08, Lideta, Addis Ababa, Ethiopia
                    </span>
                  </div>
                  <div className="w-full h-96 bg-gray-300 rounded-lg overflow-hidden mb-12">
                    <Image
                      src="/addis-ababa-map.jpg"
                      alt="Location map"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Documents Section */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Documents
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{doc.icon}</span>
                          <span className="text-gray-900 font-medium">
                            {doc.name}
                          </span>
                        </div>
                        <Download
                          size={20}
                          className="text-gray-400 hover:text-gray-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTab === 'video' && (
                <div className="bg-gray-300 h-96 rounded-lg flex items-center justify-center">
                  <p className="text-gray-600">Video tour coming soon</p>
                </div>
              )}

              {selectedTab === 'virtual' && (
                <div className="bg-gray-300 h-96 rounded-lg flex items-center justify-center">
                  <p className="text-gray-600">Virtual tour coming soon</p>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 h-fit sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Total Down Payment
              </h3>
              <p className="text-4xl font-bold text-gray-900 mb-8">
                {property.price}
              </p>
              <button
                onClick={() => setShowReservePanel(true)}
                className="w-full bg-teal-900 text-white py-3 rounded-full font-semibold hover:bg-teal-800"
              >
                Reserve Unit
              </button>

              {/* Reserve panel handled as right-side drawer */}
              <ReserveUnitPanel
                propertyId="ajsu_Aa"
                isOpen={showReservePanel}
                onClose={() => setShowReservePanel(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
