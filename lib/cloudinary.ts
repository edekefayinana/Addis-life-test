// Client-side Cloudinary upload utilities
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'property_images'); // You'll need to create this preset in Cloudinary

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  const data = await response.json();
  return data.secure_url;
};

export const uploadMultipleToCloudinary = async (
  files: File[]
): Promise<string[]> => {
  const uploadPromises = files.map((file) => uploadToCloudinary(file));
  return Promise.all(uploadPromises);
};
