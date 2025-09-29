import { useState } from "react";
import { Plus, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyCard } from "./PropertyCard";

import type { PropertyListing } from "../types";

interface PropertyManagementTabProps {
  publishedListings: PropertyListing[];
  draftListings: PropertyListing[];
  onCreateListing: () => void;
  onContinueListing: (listing: PropertyListing) => void;
}

export function PropertyManagementTab({ 
  publishedListings, 
  draftListings, 
  onCreateListing, 
  onContinueListing 
}: PropertyManagementTabProps) {
  const [listingTab, setListingTab] = useState("drafts");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Property Management</h2>
          <p className="text-neutral-600 mt-1">Manage your property listings, including published and draft properties.</p>
        </div>
        <Button onClick={onCreateListing} className="bg-primary hover:bg-primary-hover">
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
                <Button onClick={onCreateListing} className="bg-primary hover:bg-primary-hover">
                  Add New Listing
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedListings.map((listing) => (
                <PropertyCard key={listing.id} listing={listing} onContinue={onContinueListing} />
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
                  <PropertyCard key={listing.id} listing={listing} onContinue={onContinueListing} />
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
