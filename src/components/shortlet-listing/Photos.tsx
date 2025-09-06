import { Upload, X } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { usePhotoUpload } from './use-photo-upload';
import type { StepProps } from './types';

export function Photos({ form }: StepProps) {
  const { uploadedPhotos, handlePhotoUpload, removePhoto } = usePhotoUpload(form.setValue);

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
                placeholder="e.g., Luxury Oceanview Apartment in Victoria Island"
                maxLength={60}
                {...field}
              />
            </FormControl>
            <FormDescription>
              {field.value?.length || 0}/60 characters. Keep it concise for property cards.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your property, its features, nearby attractions, and what makes it special for guests..."
                maxLength={500}
                rows={4}
                {...field}
              />
            </FormControl>
            <FormDescription>
              {field.value?.length || 0}/500 characters. Highlight unique features and guest benefits.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <FormLabel>Property Photos</FormLabel>
        <FormDescription className="mb-4">Upload at least 5 photos of your property</FormDescription>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {uploadedPhotos.map((photo, index) => (
            <div key={index} className="relative group">
              <img
                src={photo}
                alt={`Property photo ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
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
          Upload Photo ({uploadedPhotos.length}/15)
        </Button>

        {uploadedPhotos.length < 5 && (
          <p className="text-sm text-red-500 mt-2">You need at least 5 photos to continue</p>
        )}
      </div>
    </div>
  );
}
