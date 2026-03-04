/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import ReserveUnitPanel from '@/components/panels/ReserveUnitPanel';
import { Button } from '@/components/ui/button';
import { cn, truncate } from '@/lib/utils';
import {
  Bath,
  Bed,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  ExternalLink,
  Grid3x3,
  Heart,
  HomeIcon,
  MapPin,
  Maximize2,
  Play,
  Share2,
  Sparkles,
  Video,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// Property type based on provided structure
export type Property = {
  id: string;
  title: string;
  builtStartDate?: string;
  propertyType?: string;
  listingType?: string;
  currentStatus?: string;
  totalBedrooms?: number;
  totalBathrooms?: number;
  parkingSpace?: number;
  areaSizeM2?: number;
  availableFloors?: string[];
  buildingSize?: string;
  deliveryTime?: string;
  address?: string;
  city?: string;
  country?: string;
  longitude?: number;
  latitude?: number;
  createdById?: string;
  createdAt?: string;
  updatedAt?: string;
  amenities?: { id: string; name: string; propertyId: string }[];
  nearbyPlaces?: { id: string; name: string; propertyId: string }[];
  images?: { id: string; url: string; propertyId: string }[];
  createdBy?: { id: string; name: string; email: string };
};

export function PropertyClient({ property }: { property: Property }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'video' | 'virtual'>(
    'overview'
  );
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';
  const [showReservePanel, setShowReservePanel] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [overviewExpanded, setOverviewExpanded] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [hasReservation, setHasReservation] = useState(false);
  const [checkingReservation, setCheckingReservation] = useState(true);

  const virtualTourImages = [
    { src: '/property-1.jpg', label: 'Living Room' },
    { src: '/pro-2.jpg', label: 'Bedroom' },
    { src: '/pro-3.jpg', label: 'Kitchen' },
    { src: '/pro-4.jpg', label: 'Bathroom' },
  ];

  // propertyImages will be derived after resolving currentProperty

  const currentProperty = property;
  // Use images from property.images (array of { url })
  const propertyImages =
    Array.isArray(currentProperty.images) && currentProperty.images.length > 0
      ? currentProperty.images.map((img: any) => {
          if (!img.url) return '/property-1.jpg';
          if (img.url.startsWith('http') || img.url.startsWith('/')) {
            return img.url;
          }
          return '/' + img.url;
        })
      : [
          '/property-1.jpg',
          '/property-2.jpg',
          '/property-3.jpg',
          '/hero-image.jpg',
        ];

  // Keyboard navigation for gallery: Escape to close, arrows to navigate
  useEffect(() => {
    if (!isGalleryOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsGalleryOpen(false);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setGalleryIndex((i) => (i + 1) % propertyImages.length);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setGalleryIndex(
          (i) => (i - 1 + propertyImages.length) % propertyImages.length
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isGalleryOpen, propertyImages.length]);

  // Check if user has already reserved this property
  useEffect(() => {
    const checkReservation = async () => {
      if (!session?.user?.id || isAdmin) {
        setCheckingReservation(false);
        return;
      }

      try {
        const res = await fetch('/api/reservations');
        if (res.ok) {
          const data = await res.json();
          const userReservation = data.data?.find(
            (r: any) =>
              r.propertyId === property.id &&
              ['PENDING', 'CONFIRMED'].includes(r.status)
          );
          setHasReservation(!!userReservation);
        }
      } catch (error) {
        console.error('Failed to check reservation:', error);
      } finally {
        setCheckingReservation(false);
      }
    };

    checkReservation();
  }, [session, property.id, isAdmin]);

  const openGallery = (index = 0) => {
    setGalleryIndex(index);
    setIsGalleryOpen(true);
  };
  const closeGallery = () => setIsGalleryOpen(false);
  const nextGalleryImage = () =>
    setGalleryIndex((i) => (i + 1) % propertyImages.length);
  const prevGalleryImage = () =>
    setGalleryIndex(
      (i) => (i - 1 + propertyImages.length) % propertyImages.length
    );

  // amenities: array of { name }
  const amenities = Array.isArray(currentProperty.amenities)
    ? currentProperty.amenities.map((a: any) => ({ name: a.name, icon: true }))
    : [];

  // nearbyPlaces: array of { name }
  const locations = Array.isArray(currentProperty.nearbyPlaces)
    ? currentProperty.nearbyPlaces.map((p: any) => ({
        distance: p.name,
        icon: true,
      }))
    : [];

  const propertyDetails = [
    {
      label: 'Built from',
      value: currentProperty.builtStartDate
        ? new Date(currentProperty.builtStartDate).toLocaleDateString()
        : 'N/A',
      icon: Calendar,
    },
    {
      label: 'Property Type',
      value: currentProperty.propertyType || 'N/A',
      icon: HomeIcon,
    },
    {
      label: 'Listing Type',
      value: currentProperty.listingType || 'N/A',
      icon: DollarSign,
    },
    {
      label: 'Work Level',
      value: currentProperty.currentStatus || 'N/A',
      icon: Clock,
    },
  ];

  // Using shared properties dataset for "Other Latest Listings"

  const availableFloors = Array.isArray(currentProperty.availableFloors)
    ? currentProperty.availableFloors.join(', ')
    : currentProperty.availableFloors || 'N/A';

  const propertySpecs = [
    {
      label: 'Total Bedroom',
      value: `${currentProperty.totalBedrooms ?? 0} Bedroom`,
    },
    {
      label: 'Total Bathroom',
      value: `${currentProperty.totalBathrooms ?? 0} Bathroom`,
    },
    {
      label: 'Carport/Parking Space',
      value: `${currentProperty.parkingSpace ?? 0} Parking`,
    },
    { label: 'Available Floors', value: `${availableFloors}` },
    {
      label: 'Building Size',
      value: currentProperty.buildingSize || 'N/A',
    },
    {
      label: 'Area Size',
      value: `${currentProperty.areaSizeM2 ?? 0} m²`,
    },
    {
      label: 'Delivery Time',
      value: currentProperty.deliveryTime || 'N/A',
    },
  ];

  const propertyLocation = {
    coords: [currentProperty.latitude, currentProperty.longitude] as [
      number,
      number,
    ],
    address: `${currentProperty.address || ''}, ${currentProperty.city || ''}, ${currentProperty.country || ''}`,
  };

  const nearbySummary = Array.isArray(currentProperty.nearbyPlaces)
    ? currentProperty.nearbyPlaces
        .slice(0, 4)
        .map((p: any) => p.name)
        .join(', ')
    : '';
  const overviewTextFull = `${currentProperty.title} is a ${currentProperty.propertyType?.toLowerCase() || ''} property featuring ${currentProperty.totalBedrooms ?? 0} bedrooms, ${currentProperty.totalBathrooms ?? 0} bathrooms, and ${currentProperty.areaSizeM2 ?? 0} m² of space. Building size: ${currentProperty.buildingSize || 'N/A'}. Current status: ${currentProperty.currentStatus || 'N/A'}. Estimated delivery: ${currentProperty.deliveryTime || 'N/A'}. Located at ${currentProperty.address || ''}, ${currentProperty.city || ''}. Nearby: ${nearbySummary}.`;
  const displayedOverview = overviewExpanded
    ? overviewTextFull
    : truncate(overviewTextFull, 240);

  return (
    <div className="min-h-screen bg-background mt-[70px] relative">
      {isAdmin && (
        <button
          className="fixed bottom-8 right-8 z-50 bg-primary text-white rounded-full shadow-lg px-6 py-3 text-lg font-bold hover:bg-primary/90 transition-all"
          aria-label="Create Property"
        >
          <Link href={`/admin/inventory/${property.id}/edit`}>Edit</Link>
        </button>
      )}
      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Property Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-0">
              {truncate(currentProperty.title, 40)}
            </h1>
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <div className="flex items-center gap-2 bg-accent py-2 sm:py-3 px-4 sm:px-5 rounded-full">
                <Bed className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <span className="text-xs sm:text-sm font-medium">
                  {currentProperty.totalBedrooms ?? 0} Beds
                </span>
              </div>
              <div className="flex items-center gap-2 bg-accent py-2 sm:py-3 px-4 sm:px-5 rounded-full">
                <Bath className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <span className="text-xs sm:text-sm font-medium">
                  {currentProperty.totalBedrooms} Baths
                </span>
              </div>
              <div className="flex items-center gap-2 bg-accent py-2 sm:py-3 px-4 sm:px-5 rounded-full">
                <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <span className="text-xs sm:text-sm font-medium">
                  {currentProperty.areaSizeM2} m²
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button className="flex items-center gap-2 px-3 sm:px-4 py-3 rounded-full hover:bg-accent transition-colors">
              <Share2 className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                Share
              </span>
            </button>
            <button className="flex items-center gap-2 px-3 sm:px-4 py-3 rounded-full hover:bg-accent transition-colors">
              <Heart className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                Save
              </span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 sm:gap-8 border-b mb-6 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-1 py-4 text-xs sm:text-sm font-medium transition-colors relative whitespace-nowrap ${
              activeTab === 'overview'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Grid3x3 className="w-4 h-4 shrink-0" />
            Overview
            {activeTab === 'overview' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cta-bg" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-1 py-4 text-xs sm:text-sm font-medium transition-colors relative whitespace-nowrap ${
              activeTab === 'video'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Video className="w-4 h-4 shrink-0" />
            Video Tour
            {activeTab === 'video' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cta-bg" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('virtual')}
            className={`flex items-center gap-2 px-1 py-4 text-xs sm:text-sm font-medium transition-colors relative whitespace-nowrap ${
              activeTab === 'virtual'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            Virtual Tour
            {activeTab === 'virtual' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cta-bg" />
            )}
          </button>
        </div>

        {/* Media Section */}
        {activeTab === 'video' && (
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden mb-8 sm:mb-12 bg-black aspect-video">
            <Image
              src="/property-2.jpg"
              alt="Property Video Tour"
              fill
              className="object-cover"
            />
            <button className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Play
                  className="w-6 h-6 sm:w-8 sm:h-8 text-foreground ml-1"
                  fill="currentColor"
                />
              </div>
            </button>
          </div>
        )}

        {activeTab === 'virtual' && (
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden mb-8 sm:mb-12 bg-black aspect-video">
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
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
            </button>
            <button
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev < virtualTourImages.length - 1 ? prev + 1 : 0
                )
              }
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
            </button>

            {/* Room Label */}
            <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground" />
              <span className="text-xs sm:text-sm font-medium">
                {virtualTourImages[currentImageIndex].label}
              </span>
            </div>

            {/* Zoom Controls */}
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-col gap-2">
              <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors">
                <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
              </button>
              <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors text-lg sm:text-xl font-medium">
                +
              </button>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 sm:mb-12">
            <div className="overflow-hidden relative aspect-4/3 rounded-xl sm:rounded-l-xl sm:rounded-bl-xl">
              <Image
                src={propertyImages[0] || '/placeholder.svg'}
                alt="Building Exterior"
                fill
                className="object-cover cursor-pointer"
                onClick={() => openGallery(0)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {propertyImages.slice(1, 5).map((img, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden relative aspect-4/3 cursor-pointer"
                  onClick={() => openGallery(idx + 1)}
                >
                  <Image
                    src={img || '/placeholder.svg'}
                    alt={`Interior ${idx + 1}`}
                    fill
                    className={cn(
                      'object-cover',
                      idx === 0 &&
                        'rounded-tl-xl sm:rounded-tl-none sm:rounded-tr-xl',
                      idx === 1 && 'rounded-tr-xl sm:rounded-tr-xl',
                      idx === 2 && 'rounded-bl-xl sm:rounded-bl-none',
                      idx === 3 && 'rounded-br-xl sm:rounded-br-xl'
                    )}
                  />
                  {idx === 3 && (
                    <div
                      className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-br-xl"
                      onClick={() => openGallery(4)}
                    >
                      <span className="text-white text-lg sm:text-xl font-semibold">
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
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">
                Overview
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                {displayedOverview}
              </p>
              <button
                onClick={() => setOverviewExpanded((prev) => !prev)}
                className="text-primary font-medium text-xs sm:text-sm flex items-center gap-1"
              >
                {overviewExpanded ? 'Show less' : 'Show more'}
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </section>

            {/* Property Details Bar */}
            <section className="p-4 sm:p-6 bg-white border rounded-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {propertyDetails.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cta-bg/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-cta-bg" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {label}
                      </p>
                      <p className="text-sm sm:text-base font-semibold">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Property Details Table */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                Property Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {propertySpecs.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border rounded-xl px-3 sm:px-4 py-3 sm:py-4 bg-white"
                  >
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-foreground sm:text-right">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Amenities */}
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
                Amenities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 border rounded-xl px-3 sm:px-4 py-3 sm:py-4 bg-white"
                  >
                    <div className="w-6 h-6 rounded-full bg-cta-bg/10 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-cta-bg" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-foreground">
                      {amenity.name}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <hr className="my-8 border-t" />

            {/* Location & Surroundings */}
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">
                Location & Surroundings
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 sm:mb-6">
                Located minutes from supermarket, highways, schools, and
                clinics, this property guarantees both primary and
                accessibility. A growing area with increasing residential value.
              </p>

              <div className="flex flex-col gap-3 mb-4 sm:mb-6">
                {locations.map((location, idx) => (
                  <div key={idx} className="flex items-center gap-4 sm:gap-6">
                    <div className="w-6 h-6 rounded-full bg-cta-bg/10 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-cta-bg" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-foreground">
                      {location.distance}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Location Map */}
            <section>
              <h3 className="text-lg sm:text-xl font-semibold mb-4">
                Location
              </h3>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-cta-bg/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-cta-bg" />
                </div>
                <span className="text-xs sm:text-sm leading-relaxed">
                  {propertyLocation.address}
                </span>
              </div>
            </section>

            {/* Amenities Download */}
            <section>
              <h3 className="text-xl font-bold mb-4">Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-cta-bg/10 flex items-center justify-center shrink-0">
                      <ExternalLink className="w-5 h-5 text-cta-bg" />
                    </div>
                    <span className="font-medium text-sm sm:text-base truncate">
                      Project Brochure
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
                </button>

                <button className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-cta-bg/10 flex items-center justify-center shrink-0">
                      <ExternalLink className="w-5 h-5 text-cta-bg" />
                    </div>
                    <span className="font-medium text-sm sm:text-base truncate">
                      Materials & Finishes Spec Sheet
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
                </button>
              </div>
            </section>
          </div>

          {/* Right Column - Pricing & Contact */}
          <div className="lg:col-span-1">
            <div className="space-y-6 lg:sticky lg:top-24">
              {!isAdmin && (
                <div className="border rounded-2xl p-4 sm:p-6 bg-white">
                  <div className="flex justify-center w-full">
                    {checkingReservation ? (
                      <Button
                        disabled
                        className="px-6 sm:px-8 py-5 sm:py-6 bg-brand-dark/50 text-white rounded-full w-full text-sm sm:text-base font-semibold"
                      >
                        Loading...
                      </Button>
                    ) : hasReservation ? (
                      <Button
                        disabled
                        className="px-6 sm:px-8 py-5 sm:py-6 bg-green-600 text-white rounded-full w-full text-sm sm:text-base font-semibold cursor-not-allowed"
                      >
                        Already Reserved
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setShowReservePanel(true)}
                        className="px-6 sm:px-8 py-5 sm:py-6 bg-brand-dark hover:bg-brand-dark/90 text-white rounded-full w-full text-sm sm:text-base font-semibold"
                      >
                        Reserve Unit
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <ReserveUnitPanel
        isOpen={showReservePanel}
        onClose={() => setShowReservePanel(false)}
        propertyId={property.id}
        onReservationSuccess={() => {
          setHasReservation(true);
          setShowReservePanel(false);
        }}
      />
      {/* Other Latest Listings - full width */}
      {/* You can fetch and display other listings here if needed, or remove this section if not applicable */}
      {isGalleryOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={closeGallery}
        >
          <div
            className="relative w-[90vw] max-w-5xl h-[70vh] bg-black rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeGallery}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-black hover:bg-white z-10"
              aria-label="Close"
            >
              <X className="w-3 h-3" />
            </button>
            <button
              onClick={prevGalleryImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={nextGalleryImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
            <div className="absolute top-3 left-3 text-white text-xs bg-black/60 px-3 py-1 rounded-full z-10">
              {galleryIndex + 1} / {propertyImages.length}
            </div>
            <div className="relative w-full h-full">
              <Image
                src={propertyImages[galleryIndex] || '/placeholder.svg'}
                alt={`Gallery image ${galleryIndex + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 90vw, 1024px"
              />
            </div>
            {/* Thumbnails strip */}
            <div className="absolute bottom-3 left-0 right-0 px-4">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {propertyImages.map((src, i) => (
                  <button
                    key={src + i}
                    onClick={() => setGalleryIndex(i)}
                    className={`relative w-20 h-14 rounded-md overflow-hidden border ${
                      i === galleryIndex ? 'border-white' : 'border-white/40'
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image
                      src={src}
                      alt={`Thumbnail ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
