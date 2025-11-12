import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Home, Trash2 } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleConfirmDelete = async () => {
    if (listing.status !== 'draft') return;
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
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] bg-neutral-200 relative">
        {/* Status Badges */}
        {listing.status === 'draft' && (
          <Badge className="absolute top-3 left-3 bg-orange-100 text-orange-800 hover:bg-orange-100">
            In progress
          </Badge>
        )}
        {listing.status === 'pending' && (
          <Badge className="absolute top-3 left-3 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending Approval
          </Badge>
        )}
        {(listing.status === 'active') && (
          <Badge className="absolute top-3 left-3 bg-green-50 text-green-700 hover:bg-green-50 border-green-200 flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live
          </Badge>
        )}
        {(listing.status === 'declined') && (
          <Badge className="absolute top-3 left-3 bg-red-100 text-red-800 hover:bg-red-100">
            Declined
          </Badge>
        )}
        {listing.images && listing.images.length > 0 ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Home className="w-12 h-12 text-neutral-400" />
          </div>
        )}
      </div>

      <CardContent className="p-4 border-t-[3px] border-primary">
        <div className="space-y-3">
          <h3 className="font-medium text-neutral-900">{listing.title}</h3>
          <p className="text-sm text-primary capitalize">{listing.type}</p>

          {listing.status === 'draft' && listing.stepsRemaining > 0 && (
            <Badge variant="outline">
              <p className="text-sm text-neutral-600">
                {listing.stepsRemaining}{' '}
                {listing.stepsRemaining === 1 ? 'step' : 'steps'} left
              </p>
            </Badge>
          )}

          {listing.status === 'draft' && !listing.stepsRemaining && (
            <Badge variant="outline">
              <p className="text-sm text-neutral-600">Review & Publish</p>
            </Badge>
          )}

          {/* <p className="text-xs text-neutral-500">{listing.lastUpdated}</p> */}

          <div className="flex items-center justify-between pt-2">
            {listing.status === 'draft' && (
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
            )}
            {listing.status === 'draft' && (
              <Button
                size="sm"
                onClick={() => onContinue(listing)}
                className="bg-primary hover:bg-primary-hover"
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
