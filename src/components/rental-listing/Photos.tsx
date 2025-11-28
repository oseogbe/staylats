import { useEffect } from 'react';
import { Upload, X } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { RichTextEditor } from '@/components/RichTextEditor';

import type { StepProps } from './types';

export function Photos({ form, photoUploadHook }: StepProps) {
  const {
    uploadedPhotos,
    handlePhotoUpload,
    removePhoto,
    fileInputRef,
    handleFileSelect,
    loadExistingPhotos
  } = photoUploadHook;

  useEffect(() => {
    const photoUrls = form.getValues('photos') || [];
    // Initializing Photos component with photoUrls
    loadExistingPhotos(photoUrls);
  }, []);

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Title</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Modern 2BR Apartment in Victoria Island"
                maxLength={60}
                {...field}
              />
            </FormControl>
            <FormDescription>
              {field.value?.length || 0}/60 characters. Keep it concise for
              property cards.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Property Description <span className="text-xs text-muted-foreground">(optional)</span></FormLabel>
            <FormControl>
              <RichTextEditor
                value={field.value || ''}
                placeholder=""
                maxLength={1000}
                className="min-h-[120px]"
                onChange={(value) => {
                  // Check if the value is just empty HTML tags
                  const isEmptyHtml = value === '<p></p>' || value === '<p><br></p>' || value === '<p><br/></p>' || value === '';
                  
                  if (isEmptyHtml) {
                    // Convert empty HTML to empty string for validation
                    field.onChange('');
                  } else {
                    field.onChange(value);
                  }
                }}
                onTextChange={(textLength) => {
                  // Trigger validation when text changes to get real-time feedback
                  form.trigger('description');
                }}
              />
            </FormControl>
            <FormDescription>
              Describe your property, its features, nearby attractions, and what makes it special for guests.
            </FormDescription>
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-md">
              <p className="text-amber-800 text-sm">
                <strong>⚠️ Important:</strong> Do not include contact
                information, phone numbers, email addresses, social media
                handles or location details in your description. This
                information will be handled separately through our secure
                contact and booking system.
              </p>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="photos"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Photos</FormLabel>
            <FormDescription className="mb-4">Upload at least 5 photos of your property (max 2MB each)</FormDescription>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {uploadedPhotos.map((photo: string, index: number) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`Property photo ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handlePhotoUpload}
              className="w-full"
              disabled={uploadedPhotos.length >= 15}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploadedPhotos.length === 0
                ? 'Select Photos'
                : `Add More Photos (${uploadedPhotos.length}/15)`}
            </Button>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}