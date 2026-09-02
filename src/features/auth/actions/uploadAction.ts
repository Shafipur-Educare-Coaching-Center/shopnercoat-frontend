'use server';

import { cookies } from 'next/headers';
import { API_BASE_URL } from '@/constants';

export async function uploadAction(formData: FormData) {
  const cookieStore = await cookies();
  const token =
    cookieStore.get('verifiedToken')?.value ||
    cookieStore.get('accessToken')?.value;

  if (!token) {
    throw new Error('Authentication required for file upload');
  }

  const file = formData.get('file') as File | null;
  if (!file || !(file instanceof File) || file.size === 0) {
    throw new Error('Please select a valid image file');
  }

  // Max 5MB check
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size exceeds the 5MB limit');
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    throw new Error('Only JPEG, PNG, and WEBP images are supported');
  }

  const forwardFormData = new FormData();
  forwardFormData.append('file', file);

  const subfolder = formData.get('subfolder') as string | null;
  if (subfolder) {
    forwardFormData.append('subfolder', subfolder);
  }

  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: forwardFormData,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'File upload failed. Please try again.');
  }

  const uploadData = data?.data;
  if (!uploadData?.url) {
    throw new Error('Upload succeeded but no image URL was returned');
  }

  return {
    success: true,
    url: uploadData.url as string,
    key: uploadData.key as string,
    filename: uploadData.filename as string,
    format: uploadData.format as string,
  };
}
