/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { propertyFormSchema as formSchema } from '@/lib/schemas/property.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X, Upload, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

type PropertyFormMode = 'create' | 'edit';

interface PropertyFormProps {
  initialData?: any;
  mode?: PropertyFormMode;
  onDeleted?: () => void;
}

import { useEffect } from 'react';
import { ProjectModal } from '@/components/inventory/ProjectModal';
import { PropertyImage, Amenity, NearbyPlace } from '@/types/property';
import { DeletePropertyDialog } from '@/components/inventory/DeletePropertyDialog';
import Image from 'next/image';

export function PropertyForm({
  initialData,
  mode = 'create',
  onDeleted,
}: PropertyFormProps) {
  const router = useRouter();
  // Transform initialData for array fields if present
  const transformedInitialData = initialData
    ? {
        ...initialData,
        builtStartDate: initialData.builtStartDate
          ? new Date(initialData.builtStartDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        availableFloors: Array.isArray(initialData.availableFloors)
          ? initialData.availableFloors.join(',')
          : typeof initialData.availableFloors === 'string'
            ? initialData.availableFloors
            : '',
        amenities: Array.isArray(initialData.amenities)
          ? initialData.amenities
              .map((a: Amenity) =>
                typeof a === 'object' && a !== null ? a.name : a
              )
              .join(',')
          : typeof initialData.amenities === 'string'
            ? initialData.amenities
            : '',
        nearbyPlaces: Array.isArray(initialData.nearbyPlaces)
          ? initialData.nearbyPlaces
              .map((a: NearbyPlace) =>
                typeof a === 'object' && a !== null ? a.name : a
              )
              .join(',')
          : typeof initialData.nearbyPlaces === 'string'
            ? initialData.nearbyPlaces
            : '',
        images: Array.isArray(initialData.images)
          ? initialData.images.map((img: PropertyImage) => ({
              id: img.id,
              url: img.url,
            }))
          : [],
      }
    : undefined;

  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [projectLoading, setProjectLoading] = useState(false);
  const [projectError, setProjectError] = useState('');
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  // Handler for when a new project is created
  const handleProjectCreated = (project: { id: string; name: string }) => {
    setProjects((prev) => [...prev, project]);
    setProjectModalOpen(false);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      setProjectLoading(true);
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        setProjects(data.data || []);
      } catch {
        setProjectError('Failed to load projects');
      } finally {
        setProjectLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const form = useForm<
    z.infer<typeof formSchema> & {
      amenities: string[];
      nearbyPlaces: string[];
      images: { id?: string; url: string }[];
    }
  >({
    resolver: zodResolver(formSchema),
    defaultValues: transformedInitialData || {
      title: '',
      builtStartDate: new Date().toISOString().split('T')[0],
      propertyType: 'APARTMENT',
      listingType: 'RENT',
      currentStatus: 'Available',
      totalBedrooms: 0,
      totalBathrooms: 0,
      parkingSpace: 0,
      areaSizeM2: 0,
      longitude: 0,
      latitude: 0,
      buildingSize: '',
      deliveryTime: '',
      address: '',
      city: '',
      country: 'Ethiopia',
      availableFloors: '1, 2',
      amenities: [],
      nearbyPlaces: [],
      images: [],
      projectId: undefined,
    },
  });
  const [amenityInput, setAmenityInput] = useState('');
  const [nearbyInput, setNearbyInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const isLoading = isPending;
  const [floorInput, setFloorInput] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  async function submitProperty(values: any) {
    let uploadedImageUrls: string[] = [];

    // Upload images to Cloudinary if there are selected files
    if (selectedImages.length > 0) {
      setUploadingImages(true);
      try {
        const formData = new FormData();
        selectedImages.forEach((file) => {
          formData.append('files', file);
        });

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload images');
        }

        const uploadData = await uploadResponse.json();
        uploadedImageUrls = uploadData.urls;
      } catch (error) {
        console.error('Image upload error:', error);
        toast.error('Failed to upload images');
        return;
      } finally {
        setUploadingImages(false);
      }
    }

    // Combine existing images with newly uploaded ones
    const existingImages = Array.isArray(values.images) ? values.images : [];
    const newImages = uploadedImageUrls.map((url) => ({ url }));
    const allImages = [...existingImages, ...newImages];

    // Convert array fields to proper format for backend
    const payload = {
      ...values,
      builtStartDate: new Date(values.builtStartDate).toISOString(),
      availableFloors:
        typeof values.availableFloors === 'string'
          ? values.availableFloors.split(',').map((s: string) => s.trim())
          : values.availableFloors,
      amenities:
        typeof values.amenities === 'string'
          ? values.amenities
              .split(',')
              .map((name: string): Amenity => ({ name: name.trim() }))
              .filter((a: Amenity) => a.name)
          : [],
      nearbyPlaces:
        typeof values.nearbyPlaces === 'string'
          ? values.nearbyPlaces
              .split(',')
              .map((name: string): NearbyPlace => ({ name: name.trim() }))
              .filter((a: NearbyPlace) => a.name)
          : [],
      images: allImages,
      projectId: values.projectId,
    };

    const method = mode === 'edit' ? 'PATCH' : 'POST';
    const url =
      mode === 'edit' ? `/api/inventory/${initialData.id}` : '/api/inventory';
    const res = await fetch(`${process.env.API_BASE_URL || ''}${url}`, {
      method,
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      toast.success(
        isEdit
          ? 'Property Updated Successfully'
          : 'Property Created Successfully'
      );
      // Navigate to property detail page with cache invalidation
      const propertyId = isEdit ? initialData.id : data.data.id;
      router.push(`/admin/inventory/${propertyId}`);
      router.refresh();
    } else {
      const errorData = await res.json();
      toast.error(errorData.error || 'Failed to save property');
    }
  }

  function onSubmit(values: any) {
    startTransition(() => submitProperty(values));
  }

  const isEdit = mode === 'edit';

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Project Modal and Button */}
      <div className="flex justify-end mb-4">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
          onClick={() => setProjectModalOpen(true)}
        >
          + New Project
        </button>
      </div>
      <ProjectModal
        open={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">
              {isEdit ? 'Edit Property' : 'Create New Property'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {isEdit
                ? 'Update the details for this property.'
                : 'Fill in all details to list this property in the inventory.'}
            </p>
          </div>
          {isEdit && initialData && (
            <DeletePropertyDialog
              propertyId={initialData.id}
              propertyTitle={initialData.title}
              onDeleted={onDeleted}
            />
          )}
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Project Select */}
          {/* {projects && projects.length > 0 ? null : ( */}
          <div className="bg-white rounded-xl border border-slate-100 p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">
                0
              </span>
              <h3 className="text-2xl font-semibold">Project</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Select Project
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={projectLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 shadow-none px-4 text-base">
                          <SelectValue
                            placeholder={
                              projectLoading ? 'Loading...' : 'Select project'
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="p-0">
                        {(Array.isArray(projects) ? projects : []).map((p) => (
                          <SelectItem
                            key={p.id}
                            value={p.id}
                            className="h-12 flex items-center text-base"
                          >
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {projectError && (
                      <div className="text-red-500 text-sm">{projectError}</div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* )} */}
          {/* Section 1: Overview */}
          <div className="bg-white rounded-xl border border-slate-100 p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">
                1
              </span>
              <h3 className="text-2xl font-semibold">General Overview</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="font-semibold">
                      Property Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Luxury Penthouse in Addis"
                        {...field}
                        className="h-12 shadow-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Property Type
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 shadow-none px-4 text-base">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="p-0">
                        {[
                          'APARTMENT',
                          'HOUSE',
                          'VILLA',
                          'CONDO',
                          'COMMERCIAL',
                        ].map((t) => (
                          <SelectItem
                            key={t}
                            value={t}
                            className="h-12 flex items-center text-base"
                          >
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Listing Type Selector */}
              <FormField
                control={form.control}
                name="listingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Listing Type
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 shadow-none px-4 text-base">
                          <SelectValue placeholder="Select listing type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="p-0">
                        {['RENT', 'SALE'].map((t) => (
                          <SelectItem
                            key={t}
                            value={t}
                            className="h-12 flex items-center text-base"
                          >
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="builtStartDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Construction Date <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="h-12 shadow-none"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Section 2: Details & Specs */}
          <div className="bg-white rounded-xl border border-slate-100 p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">
                2
              </span>
              <h3 className="text-2xl font-semibold">Property Details</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <FormField
                control={form.control}
                name="totalBedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Bedrooms</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="h-12 shadow-none"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalBathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Bathrooms</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="h-12 shadow-none"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parkingSpace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Parking</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="h-12 shadow-none"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="areaSizeM2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Area (m²)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        className="h-12 shadow-none"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="buildingSize"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="font-semibold">
                      Building Size
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., G+5, 10 floors"
                        {...field}
                        className="h-12 shadow-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveryTime"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="font-semibold">
                      Delivery Time
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 6 months, Q4 2026"
                        {...field}
                        className="h-12 shadow-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Available Floors as tag input */}
              <Controller
                name="availableFloors"
                control={form.control}
                render={({ field }) => {
                  const floorsArr =
                    typeof field.value === 'string'
                      ? field.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean)
                      : [];
                  const handleAddFloor = () => {
                    if (floorInput.trim()) {
                      const newArr = [...floorsArr, floorInput.trim()];
                      field.onChange(newArr.join(','));
                      setFloorInput('');
                    }
                  };
                  const handleRemoveFloor = (index: number) => {
                    const newArr = floorsArr.filter((_, i) => i !== index);
                    field.onChange(newArr.join(','));
                  };
                  return (
                    <div className="col-span-2">
                      <FormLabel className="font-semibold">
                        Available Floors
                      </FormLabel>
                      <div className="flex gap-2 mb-4 mt-2">
                        <Input
                          value={floorInput}
                          onChange={(e) => setFloorInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddFloor();
                            }
                          }}
                          placeholder="e.g., 1, 2, 3"
                          className="flex-1 h-12 shadow-none"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAddFloor}
                          size="icon"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      {floorsArr.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {floorsArr.map((floor, index) => (
                            <div
                              key={index}
                              className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border border-slate-200"
                            >
                              {floor}
                              <button
                                type="button"
                                onClick={() => handleRemoveFloor(index)}
                                className="hover:bg-slate-200 rounded-full p-0.5 ml-2 -mr-1"
                                title="Remove floor"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {form.formState.errors.availableFloors && (
                        <p className="text-sm text-destructive font-medium">
                          {
                            form.formState.errors.availableFloors
                              .message as string
                          }
                        </p>
                      )}
                    </div>
                  );
                }}
              />
            </div>
          </div>
          {/* Section 3: Location */}
          <div className="bg-white rounded-xl border border-slate-100 p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">
                3
              </span>
              <h3 className="text-2xl font-semibold">Location & Mapping</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-3">
                    <FormLabel className="font-semibold">
                      Full Address
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="h-12 shadow-none" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">City</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-12 shadow-none" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Longitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        {...field}
                        className="h-12 shadow-none"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Latitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        {...field}
                        className="h-12 shadow-none"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Section 4: Multi-item Lists (Relations) */}
          <div className="bg-white rounded-xl border border-slate-100 p-6 md:p-8 space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">
                4
              </span>
              <h3 className="text-2xl font-semibold">Relations & Media</h3>
            </div>
            <div className="space-y-10">
              {/* Amenities */}
              <div>
                <Label className="text-base font-semibold text-foreground">
                  Amenities
                </Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Add features and facilities available in the property
                </p>
                <Controller
                  name="amenities"
                  control={form.control}
                  render={({ field }) => {
                    // Always keep the field value as a string for zod, but use an array for UI
                    const amenitiesArr =
                      typeof field.value === 'string'
                        ? field.value
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean)
                        : [];
                    const handleAddAmenity = () => {
                      if (amenityInput.trim()) {
                        const newArr = [...amenitiesArr, amenityInput.trim()];
                        field.onChange(newArr.join(','));
                        setAmenityInput('');
                      }
                    };
                    const handleRemoveAmenity = (index: number) => {
                      const newArr = amenitiesArr.filter((_, i) => i !== index);
                      field.onChange(newArr.join(','));
                    };
                    return (
                      <>
                        <div className="flex gap-2 mb-4">
                          <Input
                            value={amenityInput}
                            onChange={(e) => setAmenityInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddAmenity();
                              }
                            }}
                            placeholder="e.g., Swimming Pool, Gym, Parking"
                            className="flex-1 h-12 bg-white shadow-none"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddAmenity}
                            size="icon"
                            className="h-11 w-11"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        {amenitiesArr.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {amenitiesArr.map((amenity, index) => (
                              <div
                                key={index}
                                className="bg-blue-50 text-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border border-blue-100"
                              >
                                {amenity}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAmenity(index)}
                                  className="hover:bg-blue-100 rounded-full p-0.5 ml-2 -mr-1"
                                  title="Remove amenity"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        {form.formState.errors.amenities && (
                          <p className="text-sm text-destructive font-medium">
                            {form.formState.errors.amenities.message ===
                            'Expected string, received array'
                              ? 'Please enter amenities as comma-separated text (e.g., "Pool, Gym, Parking")'
                              : (form.formState.errors.amenities
                                  .message as string)}
                          </p>
                        )}
                      </>
                    );
                  }}
                />
              </div>
              {/* Nearby Places */}
              <div>
                <Label className="text-base font-semibold">Nearby Places</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Add nearby landmarks, schools, hospitals, etc.
                </p>
                <Controller
                  name="nearbyPlaces"
                  control={form.control}
                  render={({ field }) => {
                    const placesArr =
                      typeof field.value === 'string'
                        ? field.value
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean)
                        : [];
                    const handleAddPlace = () => {
                      if (nearbyInput.trim()) {
                        const newArr = [...placesArr, nearbyInput.trim()];
                        field.onChange(newArr.join(','));
                        setNearbyInput('');
                      }
                    };
                    const handleRemovePlace = (index: number) => {
                      const newArr = placesArr.filter((_, i) => i !== index);
                      field.onChange(newArr.join(','));
                    };
                    return (
                      <>
                        <div className="flex gap-2 mb-4">
                          <Input
                            value={nearbyInput}
                            onChange={(e) => setNearbyInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddPlace();
                              }
                            }}
                            placeholder="e.g., St. George School, Addis Ababa University"
                            className="flex-1 h-12 shadow-none"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddPlace}
                            size="icon"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        {placesArr.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {placesArr.map((place, index) => (
                              <div
                                key={index}
                                className="bg-secondary/10 text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                              >
                                {place}
                                <button
                                  type="button"
                                  onClick={() => handleRemovePlace(index)}
                                  className="hover:bg-secondary/20 rounded-full p-0.5"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        {form.formState.errors.nearbyPlaces && (
                          <p className="text-sm text-destructive font-medium">
                            {form.formState.errors.nearbyPlaces.message ===
                            'Expected string, received array'
                              ? 'Please enter nearby places as comma-separated text (e.g., "School, Hospital, Mall")'
                              : (form.formState.errors.nearbyPlaces
                                  .message as string)}
                          </p>
                        )}
                      </>
                    );
                  }}
                />
              </div>
              {/* Images File Upload */}
              <div>
                <Label className="text-base font-semibold">
                  Property Images
                </Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload high-quality images of the property
                </p>

                <Controller
                  name="images"
                  control={form.control}
                  render={({ field }) => {
                    const handleFileSelect = (
                      e: React.ChangeEvent<HTMLInputElement>
                    ) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0) {
                        setSelectedImages((prev) => [...prev, ...files]);
                      }
                    };

                    const handleRemoveImage = (index: number) => {
                      setSelectedImages((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                    };

                    const handleRemoveExistingImage = (index: number) => {
                      const currentImages = Array.isArray(field.value)
                        ? field.value
                        : [];
                      const updatedImages = currentImages.filter(
                        (_, i) => i !== index
                      );
                      field.onChange(updatedImages);
                    };

                    const existingImages = Array.isArray(field.value)
                      ? field.value
                      : [];

                    return (
                      <>
                        {/* File Upload Area */}
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="cursor-pointer flex flex-col items-center gap-3"
                          >
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <Upload className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="text-lg font-medium text-slate-700">
                                Click to upload images
                              </p>
                              <p className="text-sm text-slate-500">
                                PNG, JPG, JPEG up to 10MB each
                              </p>
                            </div>
                          </label>
                        </div>

                        {/* Selected Images Preview */}
                        {selectedImages.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-medium mb-3">
                              Selected Images ({selectedImages.length})
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {selectedImages.map((file, index) => (
                                <div key={index} className="relative group">
                                  <div className="aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                                    <Image
                                      src={URL.createObjectURL(file)}
                                      alt={`Preview ${index + 1}`}
                                      width={300}
                                      height={300}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remove image"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                                    {file.name}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Existing Images (for edit mode) */}
                        {existingImages.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-medium mb-3">
                              Current Images ({existingImages.length})
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {existingImages.map((image, index) => (
                                <div
                                  key={image.id || index}
                                  className="relative group"
                                >
                                  <div className="aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                                    <Image
                                      src={image.url}
                                      alt={`Current ${index + 1}`}
                                      width={300}
                                      height={300}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveExistingImage(index)
                                    }
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remove image"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {form.formState.errors.images && (
                          <p className="text-sm text-destructive font-medium mt-2">
                            {form.formState.errors.images.message as string}
                          </p>
                        )}
                      </>
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading || uploadingImages}
              className="w-full h-14 text-lg font-bold border border-primary bg-primary text-white hover:bg-primary/90 transition-none"
            >
              {uploadingImages && <Spinner size="sm" className="mr-2" />}
              {isLoading && !uploadingImages && (
                <Spinner size="sm" className="mr-2" />
              )}
              {uploadingImages
                ? 'Uploading Images...'
                : isLoading
                  ? isEdit
                    ? 'Updating...'
                    : 'Creating...'
                  : isEdit
                    ? 'Update Listing'
                    : 'Create Listing'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
