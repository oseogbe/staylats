import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Home, Trash2, MapPin, Star, Users } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import listingsService from '@/services/listings';

import { PropertyListing } from '../types';

interface PropertyCardProps {
  listing: PropertyListing;
  onContinue: (listing: PropertyListing) => void;
  onDeleted?: (id: string) => void;
}

export function PropertyCard({
  listing,
  onContinue,
  onDeleted,
}: PropertyCardProps) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const isDraft = listing.status === 'draft';
  // Only live listings have a public page - the rest 404 on the slug route
  const canOpenPublicPage = listing.status === 'active' && Boolean(listing.slug);

  const handleConfirmDelete = async () => {
    if (!isDraft) return;
    try {
      setIsDeleting(true);
      await listingsService.deleteDraft(listing.id);
      setIsDeleted(true);
      toast.success('Draft deleted successfully');
      if (onDeleted) onDeleted(listing.id);
    } catch (err) {
      handleDeleteError(err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isDeleted) {
    return null;
  }

  const handleDeleteError = (error: unknown) => {
    try {
      // Attempt to parse common axios error shapes
      const anyErr: any = error as any;
      const message =
        anyErr?.response?.data?.message ||
        anyErr?.message ||
        'Failed to delete draft';
      toast.error(message);
    } catch {
      toast.error('Failed to delete draft');
    }
  };

  return (
    <Card
      className={`group overflow-hidden border-0 shadow transition-all duration-300 ${
        canOpenPublicPage ? 'cursor-pointer' : ''
      }`}
      onClick={() => {
        if (canOpenPublicPage) navigate(`/property/${listing.slug}`);
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-neutral-200">
        {listing.images && listing.images.length > 0 ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-64 flex items-center justify-center">
            <Home className="w-12 h-12 text-neutral-400" />
          </div>
        )}

        {/* Status is conveyed by the tab the card sits in, so the pill is just type */}
        <Badge
          variant="secondary"
          className="absolute top-3 left-3 bg-white/90 text-neutral-700"
        >
          {listing.type === 'shortlet' ? 'Shortlet' : 'Rental'}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4">
        {(listing.location || listing.maxGuests !== undefined) && (
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-sm text-neutral-600">
              {listing.location && (
                <>
                  <MapPin className="h-4 w-4 mr-1" />
                  {listing.location}
                </>
              )}
            </div>
            {listing.maxGuests !== undefined && (
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium mr-2">{listing.maxGuests}</span>
                <Star className="h-4 w-4 text-primary fill-current mr-1" />
                <span className="text-sm font-medium">{listing.rating ?? 0}</span>
                <span className="text-sm text-neutral-500 ml-1">
                  ({listing.reviews ?? 0})
                </span>
              </div>
            )}
          </div>
        )}

        <h3
          className={`font-semibold text-lg mb-2 line-clamp-2 transition-colors ${
            canOpenPublicPage ? 'group-hover:text-primary' : ''
          }`}
        >
          {listing.title}
        </h3>

        {listing.amenities && listing.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {listing.amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {listing.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{listing.amenities.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Drafts have no price yet - they show how much is left to fill in */}
        {isDraft ? (
          <Badge variant="outline">
            <p className="text-sm text-neutral-600">
              {listing.stepsRemaining
                ? `${listing.stepsRemaining} ${listing.stepsRemaining === 1 ? 'step' : 'steps'} left`
                : 'Review & Publish'}
            </p>
          </Badge>
        ) : (
          listing.price !== undefined && (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-neutral-900">
                  ₦{listing.price.toLocaleString()}
                </span>
                <span className="text-sm text-neutral-500 ml-1">
                  {listing.priceLabel
                    ? listing.priceLabel
                    : listing.type === 'shortlet'
                      ? '/ night'
                      : '/ month'}
                </span>
              </div>
            </div>
          )
        )}

        {isDraft && (
          <div className="flex items-center justify-between pt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete draft?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this draft listing and remove its data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              size="sm"
              onClick={() => onContinue(listing)}
              className="bg-primary hover:bg-primary-hover"
            >
              Continue
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
