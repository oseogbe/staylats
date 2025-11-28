import { useEffect } from 'react';
import { Upload, X, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

interface SortablePhotoItemProps {
  photo: string;
  index: number;
  onRemove: (index: number) => void;
}

function SortablePhotoItem({ photo, index, onRemove }: SortablePhotoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `photo-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div 
        className="absolute top-2 left-2 bg-black/70 hover:bg-black/90 text-white rounded p-1.5 cursor-grab active:cursor-grabbing z-10 transition-colors shadow-lg" 
        {...attributes} 
        {...listeners}
        title="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      <img
        src={photo}
        alt={`Property photo ${index + 1}`}
        className="w-full h-48 object-cover rounded-lg"
      />
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

export function Photos({ form, photoUploadHook }: StepProps) {
  const {
    uploadedPhotos,
    handlePhotoUpload,
    removePhoto,
    reorderPhotos,
    fileInputRef,
    handleFileSelect,
    loadExistingPhotos
  } = photoUploadHook;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeIndex = uploadedPhotos.findIndex((_, i) => `photo-${i}` === active.id);
      const overIndex = uploadedPhotos.findIndex((_, i) => `photo-${i}` === over.id);

      if (activeIndex !== -1 && overIndex !== -1) {
        reorderPhotos(activeIndex, overIndex);
      }
    }
  };

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
            <FormDescription className="mb-4">
              Upload at least 5 photos of your property (max 2MB each). Drag photos to reorder them - the first photo will be the main image.
            </FormDescription>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="relative">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToParentElement]}
              >
                <SortableContext
                  items={uploadedPhotos.map((_, index) => `photo-${index}`)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 overflow-hidden">
                  {uploadedPhotos.map((photo: string, index: number) => (
                    <SortablePhotoItem
                      key={`photo-${index}`}
                      photo={photo}
                      index={index}
                      onRemove={removePhoto}
                    />
                  ))}
                  </div>
                </SortableContext>
              </DndContext>
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