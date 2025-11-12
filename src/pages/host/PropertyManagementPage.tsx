import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyCard } from "@/components/host/property/PropertyCard";

import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/use-notifications";

import listingsService, { type DraftSummary } from "@/services/listings";
import type { PropertyListing } from "@/components/host/types";

const PropertyManagementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listingTab, setListingTab] = useState("published");
  const [publishedListings, setPublishedListings] = useState<PropertyListing[]>([]);
  const [draftListings, setDraftListings] = useState<PropertyListing[]>([]);

  // Fetch listings function that can be reused
  const fetchListings = useCallback(async () => {
    try {
      // Fetch drafts
      const draftsData = await listingsService.getDrafts();
      const mappedDrafts: PropertyListing[] = draftsData.drafts.map((d: DraftSummary) => ({
        id: d.id,
        title: d.title,
        type: d.type,
        status: 'draft',
        stepsRemaining: d.stepsRemaining,
        lastUpdated: new Date(d.lastUpdated).toLocaleString()
      }));
      setDraftListings(mappedDrafts);

      // Fetch published listings
      const publishedData = await listingsService.getUserListings();
      const mappedPublished: PropertyListing[] = publishedData.listings
        .map(listing => ({
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
      setPublishedListings(mappedPublished);
    } catch (err) {
      // silently ignore or add toast later
      console.error('Failed to fetch listings:', err);
    }
  }, []);

  // Handle real-time notification updates
  const handleNotification = useCallback((notification: any) => {
    // Update listing status immediately when approved/declined notification arrives
    if (notification.type === 'listing_approved' || notification.type === 'listing_declined') {
      const listingId = notification.metadata?.listingId;
      if (listingId) {
        // Update the specific listing's status
        setPublishedListings(prev => 
          prev.map(listing => 
            listing.id === listingId 
              ? { ...listing, status: notification.type === 'listing_approved' ? 'active' : 'declined' }
              : listing
          )
        );
      }
    }
  }, []);

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

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

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
      <Tabs value={listingTab} onValueChange={setListingTab}>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedListings.map((listing) => (
                <PropertyCard key={listing.id} listing={listing} onContinue={handleContinueListing} />
              ))}
            </div>
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
                {draftListings.map((listing) => (
                  <PropertyCard key={listing.id} listing={listing} onContinue={handleContinueListing} />
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertyManagementPage;
