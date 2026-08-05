import { useRef, useState } from 'react';
import toast from 'react-hot-toast';

export interface PhotoItem {
  url: string; // blob: preview for newly picked photos, https:// for already-uploaded ones
  fileName?: string; // Only for new photos
  file?: File; // Only for new photos - kept on the item so the file can never
  // drift out of sync with its preview when photos are reordered or removed
  isNew: boolean; // true for new photos, false for photos already stored on S3
}

/** The payload the API expects - the File objects are sent separately. */
export type PhotoItemPayload = Omit<PhotoItem, 'file'>;

/**
 * Narrow view of react-hook-form's setValue, so this hook works with any
 * listing form that has `photos` and `photoFiles` fields.
 */
export type PhotoFormSetValue = (
  name: 'photos' | 'photoFiles',
  value: any,
  options?: { shouldValidate?: boolean; shouldDirty?: boolean },
) => void;

export const MAX_PHOTOS = 15;
export const MAX_PHOTO_SIZE_BYTES = 2 * 1024 * 1024;

/**
 * Only http(s) URLs survive a page load. A blob: preview is local to the tab
 * that created it, so it must never be treated as a saved photo.
 */
export const isPersistedPhotoUrl = (url: unknown): url is string =>
  typeof url === 'string' && /^https?:\/\//i.test(url);

/**
 * Shared photo picker state for the rental and shortlet listing wizards.
 *
 * The hook lives in the wizard page (not the step component) so the selected
 * files survive step navigation - the step unmounts every time the user moves
 * between steps.
 */
export const usePhotoUpload = (setValue: PhotoFormSetValue) => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filesOf = (items: PhotoItem[]) =>
    items.flatMap((item) => (item.file ? [item.file] : []));

  const commit = (items: PhotoItem[], shouldValidate = false) => {
    setPhotos(items);
    setValue('photos', items.map((item) => item.url), { shouldValidate });
    setValue('photoFiles', filesOf(items));
  };

  /**
   * Load photos that are already stored remotely (draft loading).
   * blob: URLs are dropped: they cannot be re-uploaded from a URL alone, so
   * keeping them would publish dead links.
   */
  const loadExistingPhotos = (photoUrls: string[]) => {
    const existingPhotoItems = (photoUrls || [])
      .filter(isPersistedPhotoUrl)
      .map((url) => ({ url, isNew: false }));

    commit(existingPhotoItems);
  };

  const validateImageFile = (file: File, pending: PhotoItem[]): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Please select a valid image file';
    }

    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      return 'Image size must be less than 2MB';
    }

    // Check for duplicate file name among new photos only
    const newPhotoFileNames = [...photos, ...pending]
      .filter((photo) => photo.isNew && photo.fileName)
      .map((photo) => photo.fileName!);

    if (newPhotoFileNames.includes(file.name)) {
      return 'This image has already been selected';
    }

    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newPhotoItems: PhotoItem[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      const validationError = validateImageFile(file, newPhotoItems);
      if (validationError) {
        errors.push(validationError);
        return;
      }

      if (photos.length + newPhotoItems.length >= MAX_PHOTOS) {
        errors.push(`You can upload a maximum of ${MAX_PHOTOS} photos`);
        return;
      }

      newPhotoItems.push({
        url: URL.createObjectURL(file), // preview only - replaced by the S3 URL on upload
        fileName: file.name,
        file,
        isNew: true,
      });
    });

    if (errors.length > 0) {
      // Show toast notification for validation errors
      [...new Set(errors)].forEach((error) => {
        toast.error(error);
      });
    }

    if (newPhotoItems.length > 0) {
      commit([...photos, ...newPhotoItems], true);
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
    if (!photoToRemove) return;

    // Revoke object URL to free memory only for new photos
    if (photoToRemove.isNew) {
      URL.revokeObjectURL(photoToRemove.url);
    }

    commit(photos.filter((_, i) => i !== index), true);
  };

  const reorderPhotos = (activeIndex: number, overIndex: number) => {
    if (activeIndex === overIndex) return;

    const newPhotos = [...photos];
    const [movedPhoto] = newPhotos.splice(activeIndex, 1);
    if (!movedPhoto) return;
    newPhotos.splice(overIndex, 0, movedPhoto);

    commit(newPhotos, true);
  };

  // Computed properties for backward compatibility
  const uploadedPhotos = photos.map((photo) => photo.url);
  const existingPhotos = photos
    .filter((photo) => !photo.isNew)
    .map((photo) => photo.url);
  const uploadedFiles = filesOf(photos);
  // Serialisable view of `photos` - File objects would be lost by JSON.stringify
  const photoItems: PhotoItemPayload[] = photos.map(({ url, fileName, isNew }) => ({
    url,
    fileName,
    isNew,
  }));

  return {
    uploadedPhotos,
    uploadedFiles,
    existingPhotos,
    photos, // The PhotoItem array, including the File objects
    photoItems, // The same array, ready to be JSON-encoded for the API
    handlePhotoUpload,
    removePhoto,
    reorderPhotos,
    fileInputRef,
    handleFileSelect,
    loadExistingPhotos,
  };
};

export type PhotoUploadHook = ReturnType<typeof usePhotoUpload>;
