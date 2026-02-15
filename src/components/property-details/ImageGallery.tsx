import { Grid3X3 } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  title: string;
  onImageClick: (index: number) => void;
  onShowAll: () => void;
}

export function ImageGallery({
  images,
  title,
  onImageClick,
  onShowAll,
}: ImageGalleryProps) {
  if (images.length === 0) return null;

  const gridImages = images.slice(0, 5);
  const hasMore = images.length > 5;

  return (
    <div className="relative">
      {/* Mobile: single hero image */}
      <div className="sm:hidden relative rounded-xl overflow-hidden">
        <button onClick={() => onImageClick(0)} className="w-full">
          <img
            src={images[0]}
            alt={`${title} - Photo 1`}
            className="w-full aspect-[4/3] object-cover"
          />
        </button>
        {images.length > 1 && (
          <button
            onClick={onShowAll}
            className="absolute bottom-3 right-3 bg-white/95 hover:bg-white text-neutral-900 px-3 py-1.5 rounded-lg text-xs font-medium shadow-md flex items-center gap-1.5 transition-colors"
          >
            <Grid3X3 className="h-3.5 w-3.5" />
            Show all photos
          </button>
        )}
      </div>

      {/* Desktop: Airbnb-style grid */}
      <div className="hidden sm:grid grid-cols-4 grid-rows-2 gap-2 rounded-xl overflow-hidden h-[420px]">
        <button
          onClick={() => onImageClick(0)}
          className="col-span-2 row-span-2 relative overflow-hidden group"
        >
          <img
            src={gridImages[0]}
            alt={`${title} - Photo 1`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
        </button>

        {gridImages.slice(1).map((img, i) => (
          <button
            key={i + 1}
            onClick={() => onImageClick(i + 1)}
            className="relative overflow-hidden group"
          >
            <img
              src={img}
              alt={`${title} - Photo ${i + 2}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
          </button>
        ))}

        {gridImages.length < 5 &&
          Array.from({ length: 5 - gridImages.length }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-neutral-100 flex items-center justify-center">
              <span className="text-neutral-300 text-sm">No image</span>
            </div>
          ))}

        {(hasMore || images.length > 1) && (
          <button
            onClick={onShowAll}
            className="absolute bottom-3 right-3 bg-white/95 hover:bg-white text-neutral-900 px-3.5 py-2 rounded-lg text-sm font-medium shadow-md flex items-center gap-2 transition-colors"
          >
            <Grid3X3 className="h-4 w-4" />
            Show all photos
          </button>
        )}
      </div>
    </div>
  );
}
