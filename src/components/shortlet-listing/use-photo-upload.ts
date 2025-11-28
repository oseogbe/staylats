import { useState, useRef } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import toast from 'react-hot-toast';

import { ShortletListingFormData } from './types';

interface PhotoItem {
  url: string;
  fileName?: string; // Only for new photos
  isNew: boolean; // true for new photos, false for existing photos
}

export const usePhotoUpload = (
  setValue: UseFormSetValue<ShortletListingFormData>,
) => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to load existing photos (for draft loading)
  const loadExistingPhotos = (photoUrls: string[]) => {
    const existingPhotoItems = photoUrls.map(url => ({
      url,
      isNew: false
    }));
    setPhotos(existingPhotoItems);
    setValue('photos', photoUrls);
    // Don't set photoFiles for existing photos since we don't have the File objects
  };

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

    // Check for duplicate file name among new photos only
    const newPhotoFileNames = photos
      .filter(photo => photo.isNew && photo.fileName)
      .map(photo => photo.fileName!);
    
    if (newPhotoFileNames.includes(file.name)) {
      return 'This image has already been selected';
    }

    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newPhotoItems: PhotoItem[] = [];
    const newFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      const validationError = validateImageFile(file);
      if (validationError) {
        // errors.push(`${file.name}: ${validationError}`);
        errors.push(validationError);
        return;
      }

      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      newPhotoItems.push({
        url: objectUrl,
        fileName: file.name,
        isNew: true
      });
      newFiles.push(file);
    });

    if (errors.length > 0) {
      // Show toast notification for validation errors
      errors.forEach(error => {
        toast.error(error);
      });
      return;
    }

    if (newPhotoItems.length > 0) {
      const updatedPhotos = [...photos, ...newPhotoItems];
      const updatedFiles = [...uploadedFiles, ...newFiles];
      setPhotos(updatedPhotos);
      setUploadedFiles(updatedFiles);
      
      // Update form values
      const photoUrls = updatedPhotos.map(photo => photo.url);
      setValue('photos', photoUrls);
      setValue('photoFiles', updatedFiles);
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
    const photoToRemove = photos[index];
    
    // Revoke object URL to free memory only for new photos
    if (photoToRemove.isNew) {
      URL.revokeObjectURL(photoToRemove.url);
    }
    
    const newPhotos = photos.filter((_, i) => i !== index);
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    
    setPhotos(newPhotos);
    setUploadedFiles(newFiles);
    
    // Update form values and trigger validation
    const photoUrls = newPhotos.map(photo => photo.url);
    setValue('photos', photoUrls, { shouldValidate: true });
    setValue('photoFiles', newFiles);
  };

  const reorderPhotos = (activeIndex: number, overIndex: number) => {
    if (activeIndex === overIndex) return;

    const newPhotos = [...photos];
    const newFiles: File[] = [];

    // Reorder photos array
    const [movedPhoto] = newPhotos.splice(activeIndex, 1);
    newPhotos.splice(overIndex, 0, movedPhoto);

    // Rebuild files array to match the new photo order
    // Only include files for photos that are new
    newPhotos.forEach((photo) => {
      if (photo.isNew) {
        // Find the corresponding file from the original uploadedFiles array
        const originalPhotoIndex = photos.findIndex(p => p.url === photo.url);
        if (originalPhotoIndex >= 0 && originalPhotoIndex < uploadedFiles.length) {
          newFiles.push(uploadedFiles[originalPhotoIndex]);
        }
      }
    });

    setPhotos(newPhotos);
    setUploadedFiles(newFiles);

    // Update form values
    const photoUrls = newPhotos.map(photo => photo.url);
    setValue('photos', photoUrls, { shouldValidate: true });
    setValue('photoFiles', newFiles);
  };

  // Computed properties for backward compatibility
  const uploadedPhotos = photos.map(photo => photo.url);
  const existingPhotos = photos.filter(photo => !photo.isNew).map(photo => photo.url);

  return {
    uploadedPhotos,
    uploadedFiles,
    existingPhotos,
    photos, // Return the PhotoItems array
    handlePhotoUpload,
    removePhoto,
    reorderPhotos,
    fileInputRef,
    handleFileSelect,
    loadExistingPhotos
  };
};
