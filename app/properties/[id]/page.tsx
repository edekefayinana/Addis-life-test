'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Bed,
  Bath,
  Maximize2,
  Share2,
  Heart,
  Play,
  Grid3x3,
  Video,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Calendar,
  HomeIcon,
  DollarSign,
  Clock,
  MapPin,
  Check,
  ExternalLink,
} from 'lucide-react';
import { PropertyCard } from '@/components/PropertyCard';
import { cn } from '@/lib/utils';

const LeafletMap = dynamic(
  () => import('./LeafletMap').then((m) => m.LeafletMap),
  { ssr: false }
);

export default function PropertyPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'video' | 'virtual'>(
    'overview'
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const virtualTourImages = [
    { src: '/property-1.jpg', label: 'Living Room' },
    { src: '/pro-2.jpg', label: 'Bedroom' },
    { src: '/pro-3.jpg', label: 'Kitchen' },
    { src: '/pro-4.jpg', label: 'Bathroom' },
  ];

  const propertyImages = [
    '/property-1.jpg',
    '/property-2.jpg',
    '/property-3.jpg',
    '/hero-image.jpg',
    '/hero-image.jpg',
    '/hero-image.jpg',
  ];

  const amenities = [
    { name: 'Elevator', icon: true },
    { name: 'Garbage Shoot', icon: true },
    { name: "Kid's Zone", icon: true },
    { name: 'Parking Space', icon: true },
    { name: 'CCTV Surveillance', icon: true },
    { name: 'Green Terrace', icon: true },
    { name: 'EV Charging Station', icon: true },
    { name: 'Water Storage', icon: true },
    { name: 'Parking Spot', icon: true },
  ];

  const locations = [
    { distance: '5 min to supermarket', icon: true },
    { distance: '10 min to schools', icon: true },
    { distance: '24/7 transport access', icon: true },
  ];

  const propertyDetails = [
    { label: 'Built from', value: '2023 Year', icon: Calendar },
    { label: 'Property Type', value: 'Residential', icon: HomeIcon },
    { label: 'Price Per M²', value: '78,000 ETB', icon: DollarSign },
    { label: 'Work Level', value: 'Excavation to begin', icon: Clock },
  ];

  const otherListings = [
    {
      title: 'Vatican site - Three BedRoom Apartment',
      location: 'Sarbet Blue Point, Sarbet',
      beds: 4,
      baths: 2,
      sqft: 450,
      image: '/pro-4.jpg',
    },
    {
      title: 'Vatican site - Three BedRoom Apartment',
      location: 'Sarbet Blue Point, Sarbet',
      beds: 4,
      baths: 2,
      sqft: 450,
      image: '/pro-5.jpg',
    },
    {
      title: 'Vatican site - Three BedRoom Apartment',
      location: 'Sarbet Blue Point, Sarbet',
      beds: 4,
      baths: 2,
      sqft: 450,
      image: '/pro-6.jpg',
    },
  ];

  const propertySpecs = [
    { label: 'Total Bedroom', value: '3 Bedroom' },
    { label: 'Furnishing', value: '3 Bedroom' },
    { label: 'Total Bathroom', value: '2 Bathroom' },
    { label: 'Kitchen', value: 'Modern & Traditional kitchen' },
    { label: 'Carport/Parking Space', value: '2 Car Garage' },
    { label: 'Outdoor Space', value: 'Private' },
    { label: 'Building Size', value: 'G+20+T' },
    { label: 'Area Size', value: '450 sqft' },
    { label: 'Delivery Time', value: '36 Months' },
  ];

  const propertyLocation = {
    coords: [9.0108, 38.7546] as [number, number],
    address: 'Sarbet Blue Point, Sarbet, Addis Ababa Ethiopia',
  };

  return (
    <div className="min-h-screen bg-background mt-[70px]">
      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Property Title Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 flex items-center gap-6">
            <h1 className="text-3xl font-semibold text-foreground mb-0">
              Vatican site - Three BedRoom Apartment
            </h1>
            <div className="flex items-center gap-4 justify-self-start">
              <div className="flex items-center gap-2 bg-accent py-3 px-5 rounded-full">
                <Bed className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium">3 Beds</span>
              </div>
              <div className="flex items-center gap-2 bg-accent py-3 px-5 rounded-full">
                <Bath className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium">2 Baths</span>
              </div>
              <div className="flex items-center gap-2 bg-accent py-3 px-5 rounded-full">
                <Maximize2 className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium">450 sqft</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full  hover:bg-accent transition-colors">
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">Share</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-accent transition-colors">
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">Save</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-1 py-4 text-sm font-medium transition-colors relative ${
              activeTab === 'overview'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
            Overview
            {activeTab === 'overview' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cta-bg" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-1 py-4 text-sm font-medium transition-colors relative ${
              activeTab === 'video'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Video className="w-4 h-4" />
            Video Tour
            {activeTab === 'video' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cta-bg" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('virtual')}
            className={`flex items-center gap-2 px-1 py-4 text-sm font-medium transition-colors relative ${
              activeTab === 'virtual'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Virtual Tour
            {activeTab === 'virtual' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cta-bg" />
            )}
          </button>
        </div>

        {/* Media Section */}
        {activeTab === 'video' && (
          <div className="relative rounded-2xl overflow-hidden mb-12 bg-black aspect-video">
            <Image
              src="/property-2.jpg"
              alt="Property Video Tour"
              fill
              className="object-cover"
            />
            <button className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Play
                  className="w-8 h-8 text-foreground ml-1"
                  fill="currentColor"
                />
              </div>
            </button>
          </div>
        )}

        {activeTab === 'virtual' && (
          <div className="relative rounded-2xl overflow-hidden mb-12 bg-black aspect-video">
            <Image
              src={
                virtualTourImages[currentImageIndex].src || '/placeholder.svg'
              }
              alt={virtualTourImages[currentImageIndex].label}
              fill
              className="object-cover"
            />

            {/* Navigation Buttons */}
            <button
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev > 0 ? prev - 1 : virtualTourImages.length - 1
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
            <button
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev < virtualTourImages.length - 1 ? prev + 1 : 0
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>

            {/* Room Label */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg">
              <Sparkles className="w-4 h-4 text-foreground" />
              <span className="text-sm font-medium">
                {virtualTourImages[currentImageIndex].label}
              </span>
            </div>

            {/* Zoom Controls */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <button className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors">
                <Maximize2 className="w-5 h-5 text-foreground" />
              </button>
              <button className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors text-xl font-medium">
                +
              </button>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 gap-4 mb-12">
            <div className="overflow-hidden relative aspect-[4/3] rounded-l-xl rounded-bl-xl">
              <Image
                src={propertyImages[0] || '/placeholder.svg'}
                alt="Building Exterior"
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {propertyImages.slice(1, 5).map((img, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden relative aspect-[4/3]"
                >
                  <Image
                    src={img || '/placeholder.svg'}
                    alt={`Interior ${idx + 1}`}
                    fill
                    className={cn(
                      'object-cover',
                      idx === 1 && 'rounded-tr-xl',
                      idx === 3 && 'rounded-br-xl'
                    )}
                  />
                  {idx === 3 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-br-xl">
                      <span className="text-white text-xl font-semibold">
                        +{propertyImages.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This three-bedroom apartment for sale in Ethiopia offers a
                spacious and thoughtfully designed living environment, perfect
                for families or individuals seeking comfort and style. The
                apartment features three well-appointed bedrooms, providing
                ample space, including the option to create a home office or add
                extra storage. Residents also enjoy 0,700 sq.ft of alerts also
                enjoy 0,700 sq.ft of common area including terraces, a 750 sq.ft
                garden for...
              </p>
              <button className="text-primary font-medium text-sm flex items-center gap-1">
                Show more
                <ChevronRight className="w-4 h-4" />
              </button>
            </section>

            {/* Property Details Bar */}
            <section className="p-6 bg-white border rounded-2xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {propertyDetails.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cta-bg/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-cta-bg" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-muted-foreground">{label}</p>
                      <p className="font-semibold">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Property Details Table */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Property Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {propertySpecs.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between border rounded-xl px-4 py-4 bg-white"
                  >
                    <span className="text-sm text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Amenities */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Amenities</h2>
              <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
                {amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 border rounded-xl px-4 py-4 bg-white"
                  >
                    <div className="w-6 h-6 rounded-full bg-cta-bg/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-cta-bg" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {amenity.name}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <hr className="my-8 border-t" />

            {/* Location & Surroundings */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Location & Surroundings
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Located minutes from supermarket, highways, schools, and
                clinics, this property guarantees both primary and
                accessibility. A growing area with increasing residential value.
              </p>

              <div className="flex flex-col gap-3 mb-6">
                {locations.map((location, idx) => (
                  <div key={idx} className="flex items-center gap-6">
                    <div className="w-6 h-6 rounded-full bg-cta-bg/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-cta-bg" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {location.distance}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Location Map */}
            <section>
              <h3 className="text-xl font-semibold mb-4">Location</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-cta-bg/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-cta-bg" />
                </div>
                <span className="text-sm">{propertyLocation.address}</span>
              </div>
              <LeafletMap position={propertyLocation.coords} />
            </section>

            {/* Amenities Download */}
            <section>
              <h3 className="text-xl font-bold mb-4">Amenities</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cta-bg/10 flex items-center justify-center">
                      <ExternalLink className="w-5 h-5 text-cta-bg" />
                    </div>
                    <span className="font-medium">Project Brochure</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </button>

                <button className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cta-bg/10 flex items-center justify-center">
                      <ExternalLink className="w-5 h-5 text-cta-bg" />
                    </div>
                    <span className="font-medium">
                      Materials & Finishes Spec Sheet
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </section>
          </div>

          {/* Right Column - Pricing & Contact */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-24">
              <div className="border rounded-2xl p-6 bg-white">
                <p className="text-sm text-muted-foreground mb-1">
                  Total Down Payment
                </p>
                <p className="text-3xl font-semibold mb-8">ETB 3,300,000</p>
                <div className="flex justify-center w-full">
                  <Button className="px-8 py-6 bg-brand-dark hover:bg-brand-dark/90 text-white rounded-full w-full text-base font-semibold">
                    Call to Invest
                  </Button>
                </div>
              </div>

              <div className="border rounded-2xl p-6 bg-white">
                <h3 className="text-lg font-bold mb-4">Ask About This Home</h3>
                <form className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Biruk Solomon"
                      className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-dark"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Example1@gmail.com"
                      className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-dark"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="(+251)-911-201096"
                      className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-dark"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="Write Your questions in detail..."
                      rows={4}
                      className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-dark resize-none"
                    />
                  </div>

                  <div className="flex justify-center w-full">
                    <Button className="px-8 py-6 bg-brand-dark hover:bg-brand-dark/90 text-white rounded-full w-full text-base font-semibold">
                      Send
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Other Latest Listings - full width */}
      <section className="max-w-[1400px] mx-auto px-6 pb-12 mb-12">
        <h2 className="text-2xl font-semibold mb-6">Other Latest Listings</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {otherListings.map((listing, idx) => (
            <PropertyCard
              key={idx}
              title={listing.title}
              location={listing.location}
              beds={listing.beds}
              baths={listing.baths}
              area={listing.sqft}
              imageUrl={listing.image}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
