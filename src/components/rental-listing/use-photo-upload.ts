import { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { RentalListingFormData } from './types';

export const usePhotoUpload = (setValue: UseFormSetValue<RentalListingFormData>) => {
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  const handlePhotoUpload = () => {
    // Mock photo upload - replace with actual upload logic
    const mockPhotoUrl = `https://picsum.photos/800/600?random=${uploadedPhotos.length + 1}`;
    const newPhotos = [...uploadedPhotos, mockPhotoUrl];
    setUploadedPhotos(newPhotos);
    setValue('photos', newPhotos);
  };

  const removePhoto = (index: number) => {
    const newPhotos = uploadedPhotos.filter((_, i) => i !== index);
    setUploadedPhotos(newPhotos);
    setValue('photos', newPhotos);
  };

  return {
    uploadedPhotos,
    handlePhotoUpload,
    removePhoto
  };
};
