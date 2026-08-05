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

import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { MAX_PHOTOS, type PhotoUploadHook } from '@/hooks/use-photo-upload';

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

interface PropertyPhotosFieldProps {
  form: any;
  photoUploadHook: PhotoUploadHook;
}

/**
 * Photo picker shared by the rental and shortlet listing wizards: a sortable
 * grid of previews backed by `usePhotoUpload`.
 */
export function PropertyPhotosField({ form, photoUploadHook }: PropertyPhotosFieldProps) {
  const {
    photos,
    uploadedPhotos,
    handlePhotoUpload,
    removePhoto,
    reorderPhotos,
    fileInputRef,
    handleFileSelect,
    loadExistingPhotos,
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

  // Hydrate from the form value only while the hook is still empty - e.g. a
  // draft whose URLs were loaded into the form before this step first mounted.
  // This step unmounts on every wizard navigation, so re-hydrating on each mount
  // would relabel freshly picked photos as already-uploaded ones and their
  // blob: previews would be published instead of the S3 URLs.
  // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only, by design
  useEffect(() => {
    if (photos.length > 0) return;
    loadExistingPhotos(form.getValues('photos') || []);
  }, []);

  return (
    <FormField
      control={form.control}
      name="photos"
      render={() => (
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
            disabled={uploadedPhotos.length >= MAX_PHOTOS}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploadedPhotos.length === 0
              ? 'Select Photos'
              : `Add More Photos (${uploadedPhotos.length}/${MAX_PHOTOS})`}
          </Button>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
