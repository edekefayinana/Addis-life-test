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
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { useTransition } from 'react';

type PropertyFormMode = 'create' | 'edit';

interface PropertyFormProps {
  initialData?: any;
  mode?: PropertyFormMode;
}

import { useEffect } from 'react';
import { ProjectModal } from '@/components/inventory/ProjectModal';

export function PropertyForm({
  initialData,
  mode = 'create',
}: PropertyFormProps) {
  // Transform initialData for array fields if present
  // Explicit types for DB schema
  type Amenity = { id?: string; name: string };
  type NearbyPlace = { id?: string; name: string };
  type PropertyImage = { id?: string; url: string };

  const transformedInitialData = initialData
    ? {
        ...initialData,
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
          ? initialData.images
              .map((a: PropertyImage) =>
                typeof a === 'object' && a !== null ? a.url : a
              )
              .join(',')
          : typeof initialData.images === 'string'
            ? initialData.images
            : '',
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
        setProjects(data);
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
      images: string[];
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
  const [imageInput, setImageInput] = useState('');

  async function submitProperty(values: any) {
    console.log(values);

    // Convert array fields to comma-separated strings for schema validation
    const fixedValues = {
      ...values,
      amenities: Array.isArray(values.amenities)
        ? values.amenities.join(',')
        : values.amenities,
      nearbyPlaces: Array.isArray(values.nearbyPlaces)
        ? values.nearbyPlaces.join(',')
        : values.nearbyPlaces,
      images: Array.isArray(values.images)
        ? values.images.join(',')
        : values.images,
    };

    // Now build the payload for backend (with availableFloors as array, and amenities, nearbyPlaces, images as arrays of objects)
    const payload = {
      ...fixedValues,
      builtStartDate: new Date(fixedValues.builtStartDate).toISOString(),
      availableFloors:
        typeof fixedValues.availableFloors === 'string'
          ? fixedValues.availableFloors.split(',').map((s: string) => s.trim())
          : fixedValues.availableFloors,
      amenities:
        typeof fixedValues.amenities === 'string'
          ? fixedValues.amenities
              .split(',')
              .map((name: string): Amenity => ({ name: name.trim() }))
              .filter((a: Amenity) => a.name)
          : [],
      nearbyPlaces:
        typeof fixedValues.nearbyPlaces === 'string'
          ? fixedValues.nearbyPlaces
              .split(',')
              .map((name: string): NearbyPlace => ({ name: name.trim() }))
              .filter((a: NearbyPlace) => a.name)
          : [],
      images:
        typeof fixedValues.images === 'string'
          ? fixedValues.images
              .split(',')
              .map((url: string): PropertyImage => ({ url: url.trim() }))
              .filter((a: PropertyImage) => a.url)
          : [],
      projectId: fixedValues.projectId,
    };

    console.log('PAYLOAD', payload);

    const method = mode === 'edit' ? 'PATCH' : 'POST';
    const url = mode === 'edit' ? `/inventory/${initialData.id}` : '/inventory';
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}${url}`, {
      method,
      body: JSON.stringify(payload),
    });
    if (res.ok)
      toast.success(
        isEdit
          ? 'Property Updated Successfully'
          : 'Property Created Successfully'
      );
  }

  function onSubmit(values: any) {
    startTransition(() => submitProperty(values));
  }

  const isEdit = mode === 'edit';
  // Wrapper to convert array fields to strings before validation
  function handleFormSubmit(values: any) {
    const fixedValues = {
      ...values,
      amenities: Array.isArray(values.amenities)
        ? values.amenities.join(',')
        : values.amenities,
      nearbyPlaces: Array.isArray(values.nearbyPlaces)
        ? values.nearbyPlaces.join(',')
        : values.nearbyPlaces,
      images: Array.isArray(values.images)
        ? values.images.join(',')
        : values.images,
    };
    return onSubmit(fixedValues);
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl">
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
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">
          {isEdit ? 'Edit Property' : 'Create New Property'}
        </h1>
        <p className="text-lg text-muted-foreground">
          {isEdit
            ? 'Update the details for this property.'
            : 'Fill in all details to list this property in the inventory.'}
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-8"
        >
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
                      Construction Date
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="h-12 shadow-none"
                      />
                    </FormControl>
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
                            {form.formState.errors.amenities.message as string}
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
                          <p className="text-sm text-destructive">
                            {
                              form.formState.errors.nearbyPlaces
                                .message as string
                            }
                          </p>
                        )}
                      </>
                    );
                  }}
                />
              </div>
              {/* Images (keep as comma separated for now) */}
              <Controller
                name="images"
                control={form.control}
                render={({ field }) => {
                  const imagesArr =
                    typeof field.value === 'string'
                      ? field.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean)
                      : [];
                  const handleAddImage = () => {
                    if (imageInput.trim()) {
                      const newArr = [...imagesArr, imageInput.trim()];
                      field.onChange(newArr.join(','));
                      setImageInput('');
                    }
                  };
                  const handleRemoveImage = (index: number) => {
                    const newArr = imagesArr.filter((_, i) => i !== index);
                    field.onChange(newArr.join(','));
                  };
                  return (
                    <>
                      <FormLabel className="font-semibold">
                        Image URLs
                      </FormLabel>
                      <div className="flex gap-2 mb-4 mt-2">
                        <Input
                          value={imageInput}
                          onChange={(e) => setImageInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddImage();
                            }
                          }}
                          placeholder="https://image1.jpg, https://image2.jpg"
                          className="flex-1 h-12 shadow-none"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAddImage}
                          size="icon"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      {imagesArr.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {imagesArr.map((img, index) => (
                            <div
                              key={index}
                              className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border border-slate-200"
                            >
                              {img}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="hover:bg-slate-200 rounded-full p-0.5 ml-2 -mr-1"
                                title="Remove image"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {form.formState.errors.images && (
                        <p className="text-sm text-destructive font-medium">
                          {form.formState.errors.images.message as string}
                        </p>
                      )}
                    </>
                  );
                }}
              />
            </div>
          </div>
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 text-lg font-bold border border-primary bg-primary text-white hover:bg-primary/90 transition-none"
            >
              {isLoading && <Spinner size="sm" className="mr-2" />}
              {isEdit ? 'Update Listing' : 'Create Listing'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
