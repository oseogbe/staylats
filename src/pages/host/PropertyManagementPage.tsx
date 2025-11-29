import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FileText } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PropertyCard } from "@/components/host/property/PropertyCard";

import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/use-notifications";
import { useUserListings, useUserDrafts } from "@/hooks/use-listings";

import { type DraftSummary } from "@/services/listings";
import type { PropertyListing } from "@/components/host/types";

const PropertyManagementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [listingTab, setListingTab] = useState("published");
  const [publishedPage, setPublishedPage] = useState(1);
  const [draftPage, setDraftPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch listings with React Query (cached automatically)
  const { data: rawPublishedListings = [], isLoading: publishedLoading } = useUserListings();
  const { data: rawDrafts = [], isLoading: draftsLoading } = useUserDrafts();

  // Transform published listings data
  const publishedListings = useMemo<PropertyListing[]>(() => {
    return rawPublishedListings.map(listing => ({
      id: listing.id,
      title: listing.title,
      type: listing.type,
      status: listing.status,
      description: listing.description,
      address: listing.address,
      propertyType: listing.propertyType,
      images: listing.images,
      amenities: listing.amenities,
      lastUpdated: new Date(listing.updatedAt).toLocaleString()
    }));
  }, [rawPublishedListings]);

  // Transform drafts data
  const draftListings = useMemo<PropertyListing[]>(() => {
    return rawDrafts.map((d: DraftSummary) => ({
      id: d.id,
      title: d.title,
      type: d.type,
      status: 'draft',
      stepsRemaining: d.stepsRemaining,
      lastUpdated: new Date(d.lastUpdated).toLocaleString()
    }));
  }, [rawDrafts]);

  // Handle real-time notification updates
  const handleNotification = useCallback((notification: any) => {
    // Update listing status immediately when approved/declined notification arrives
    if (notification.type === 'listing_approved' || notification.type === 'listing_declined') {
      const listingId = notification.metadata?.listingId;
      if (listingId) {
        // Update the cache directly for immediate UI update
        queryClient.setQueryData(['userListings'], (old: any[] = []) => 
          old.map(listing => 
            listing.id === listingId 
              ? { ...listing, status: notification.type === 'listing_approved' ? 'active' : 'declined' }
              : listing
          )
        );
      }
    }
  }, [queryClient]);

  // Initialize WebSocket with notification callback
  useNotifications(user?.id || '', {
    onNotification: handleNotification
  });

  const handleCreateListing = () => {
    navigate("/host/create-listing");
  };

  const handleContinueListing = (listing: PropertyListing) => {
    if (listing.type === "rental") {
      navigate("/host/create-rental-listing", { state: { draftId: listing.id } });
    } else {
      navigate("/host/create-shortlet-listing", { state: { draftId: listing.id } });
    }
  };

  // Reset page when switching tabs
  const handleTabChange = (value: string) => {
    setListingTab(value);
    if (value === "published") {
      setPublishedPage(1);
    } else {
      setDraftPage(1);
    }
  };

  // Calculate pagination for published listings
  const publishedTotalPages = Math.ceil(publishedListings.length / itemsPerPage);
  const publishedPaginatedListings = useMemo(() => {
    const startIndex = (publishedPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return publishedListings.slice(startIndex, endIndex);
  }, [publishedListings, publishedPage, itemsPerPage]);

  // Calculate pagination for draft listings
  const draftTotalPages = Math.ceil(draftListings.length / itemsPerPage);
  const draftPaginatedListings = useMemo(() => {
    const startIndex = (draftPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return draftListings.slice(startIndex, endIndex);
  }, [draftListings, draftPage, itemsPerPage]);

  // React Query handles fetching automatically, no useEffect needed

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Property Management</h2>
          <p className="text-neutral-600 mt-1">Manage your property listings, including published and draft properties.</p>
        </div>
        <Button onClick={handleCreateListing} className="bg-primary hover:bg-primary-hover">
          <Plus className="w-4 h-4 mr-2" />
          Add New Listing
        </Button>
      </div>

      {/* Property Listings Tabs */}
      <Tabs value={listingTab} onValueChange={handleTabChange}>
        <TabsList className="bg-neutral-100">
          <TabsTrigger value="published" className="data-[state=active]:bg-white">
            Published ({publishedListings.length})
          </TabsTrigger>
          <TabsTrigger value="drafts" className="data-[state=active]:bg-white">
            Drafts ({draftListings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="published" className="mt-6">
          {publishedListings.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="mx-auto w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Published Properties found!</h3>
                <p className="text-neutral-600 mb-6">Start managing your properties by publishing your first listing.</p>
                <Button onClick={handleCreateListing} className="bg-primary hover:bg-primary-hover">
                  Add New Listing
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publishedPaginatedListings.map((listing) => (
                  <PropertyCard key={listing.id} listing={listing} onContinue={handleContinueListing} />
                ))}
              </div>
              {publishedTotalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setPublishedPage((prev) => Math.max(prev - 1, 1))}
                          className={publishedPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {Array.from({ length: publishedTotalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setPublishedPage(page)}
                            isActive={publishedPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setPublishedPage((prev) => Math.min(prev + 1, publishedTotalPages))}
                          className={publishedPage === publishedTotalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="drafts" className="mt-6">
          {draftListings.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="mx-auto w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Draft Properties found!</h3>
                <p className="text-neutral-600 mb-6">Incomplete listings can be found here.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-neutral-900 mb-2">Complete these property listings to publish them on the platform</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {draftPaginatedListings.map((listing) => (
                  <PropertyCard key={listing.id} listing={listing} onContinue={handleContinueListing} />
                ))}
              </div>
              {draftTotalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setDraftPage((prev) => Math.max(prev - 1, 1))}
                          className={draftPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {Array.from({ length: draftTotalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setDraftPage(page)}
                            isActive={draftPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setDraftPage((prev) => Math.min(prev + 1, draftTotalPages))}
                          className={draftPage === draftTotalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertyManagementPage;
