import { useState, useRef } from 'react';
import { UseFormSetValue, UseFormSetError, UseFormClearErrors } from 'react-hook-form';
import { ShortletListingFormData } from './types';

export const usePhotoUpload = (
  setValue: UseFormSetValue<ShortletListingFormData>,
  setError: UseFormSetError<ShortletListingFormData>,
  clearErrors: UseFormClearErrors<ShortletListingFormData>
) => {
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateImageFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Please select a valid image file';
    }

    // Check file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      return 'Image size must be less than 2MB';
    }

    // Check for duplicate file name
    if (uploadedFileNames.includes(file.name)) {
      return 'This image has already been selected';
    }

    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Clear any existing errors first
    clearErrors('photos');

    const newPhotos: string[] = [];
    const newFileNames: string[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      const validationError = validateImageFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
        return;
      }

      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      newPhotos.push(objectUrl);
      newFileNames.push(file.name);
    });

    if (errors.length > 0) {
      // Set form error instead of showing alert
      setError('photos', {
        type: 'manual',
        message: errors.join('; ')
      });
      return;
    }

    if (newPhotos.length > 0) {
      const updatedPhotos = [...uploadedPhotos, ...newPhotos];
      const updatedFileNames = [...uploadedFileNames, ...newFileNames];
      setUploadedPhotos(updatedPhotos);
      setUploadedFileNames(updatedFileNames);
      setValue('photos', updatedPhotos);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const removePhoto = (index: number) => {
    const photoToRemove = uploadedPhotos[index];
    
    // Revoke object URL to free memory
    URL.revokeObjectURL(photoToRemove);
    
    const newPhotos = uploadedPhotos.filter((_, i) => i !== index);
    const newFileNames = uploadedFileNames.filter((_, i) => i !== index);
    setUploadedPhotos(newPhotos);
    setUploadedFileNames(newFileNames);
    setValue('photos', newPhotos);
  };

  return {
    uploadedPhotos,
    handlePhotoUpload,
    removePhoto,
    fileInputRef,
    handleFileSelect
  };
};
