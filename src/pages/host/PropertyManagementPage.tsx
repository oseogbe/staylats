import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FileText } from "lucide-react";

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
import { useCreateListingPrompt } from "@/contexts/CreateListingPromptContext";
import {
  useHostListings,
  useListingStatusChanges,
  tabForStatus,
  type HostListingTab,
} from "@/hooks/use-host-listings";

import type { PropertyListing } from "@/components/host/types";

interface TabConfig {
  value: HostListingTab;
  label: string;
  /** Shown above the grid when the tab has listings */
  heading?: string;
  emptyTitle: string;
  emptyBody: string;
  /** Whether the empty state offers to start a new listing */
  emptyCta?: boolean;
}

const TABS: TabConfig[] = [
  {
    value: "live",
    label: "Live",
    emptyTitle: "No live listings yet",
    emptyBody: "Listings appear here once an admin approves them.",
    emptyCta: true,
  },
  {
    value: "pending",
    label: "Pending",
    emptyTitle: "Nothing awaiting approval",
    emptyBody: "Listings you submit stay here until an admin reviews them.",
  },
  {
    value: "drafts",
    label: "Drafts",
    heading: "Complete these property listings to publish them on the platform",
    emptyTitle: "No draft properties found!",
    emptyBody: "Incomplete listings can be found here.",
    emptyCta: true,
  },
  {
    value: "rejected",
    label: "Rejected",
    emptyTitle: "No rejected listings",
    emptyBody: "Listings an admin declines appear here so you can fix and resubmit them.",
  },
];

const ITEMS_PER_PAGE = 6;

const PropertyManagementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openPrompt: openCreateListingPrompt } = useCreateListingPrompt();
  const [activeTab, setActiveTab] = useState<HostListingTab>("live");
  const [page, setPage] = useState(1);

  const { groups } = useHostListings(user?.id);

  // A decision arriving over the socket moves a listing out of the tab in view.
  // Without a status pill on the card, silently vanishing is confusing - follow
  // it instead. Other tabs are left alone so the host is never yanked around.
  useListingStatusChanges(user?.id, ({ status }) => {
    if (activeTab !== "pending") return;
    setActiveTab(tabForStatus(status));
    setPage(1);
  });

  const handleCreateListing = () => {
    openCreateListingPrompt();
  };

  const handleContinueListing = (listing: PropertyListing) => {
    if (listing.type === "rental") {
      navigate("/host/create-rental-listing", { state: { draftId: listing.id } });
    } else {
      navigate("/host/create-shortlet-listing", { state: { draftId: listing.id } });
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as HostListingTab);
    setPage(1);
  };

  const renderTab = (tab: TabConfig) => {
    const listings = groups[tab.value];

    if (listings.length === 0) {
      return (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">{tab.emptyTitle}</h3>
            <p className="text-neutral-600 mb-6">{tab.emptyBody}</p>
            {tab.emptyCta && (
              <Button onClick={handleCreateListing} className="bg-primary hover:bg-primary-hover">
                Add New Listing
              </Button>
            )}
          </CardContent>
        </Card>
      );
    }

    const totalPages = Math.max(1, Math.ceil(listings.length / ITEMS_PER_PAGE));
    // A listing moving tabs under us can shrink the list past the current page
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginated = listings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
      <>
        {tab.heading && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">{tab.heading}</h3>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((listing) => (
            <PropertyCard
              key={listing.id}
              listing={listing}
              onContinue={handleContinueListing}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => setPage(pageNumber)}
                      isActive={currentPage === pageNumber}
                      className="cursor-pointer"
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    className={
                      currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-neutral-900">Listings</h2>
          <p className="text-neutral-600 mt-1 text-sm sm:text-base">
            Manage your property listings, from drafts through to live.
          </p>
        </div>
        <Button
          onClick={handleCreateListing}
          className="w-full shrink-0 bg-primary hover:bg-primary-hover sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Listing
        </Button>
      </div>

      {/* Property Listings Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="flex h-auto min-h-11 w-full gap-1 bg-neutral-100 p-1 sm:inline-flex sm:w-auto sm:min-h-10">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="min-h-10 flex-1 px-2 py-2.5 text-sm sm:flex-none sm:px-3 sm:py-1.5 data-[state=active]:bg-white"
            >
              {tab.label} ({groups[tab.value].length})
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6">
            {renderTab(tab)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default PropertyManagementPage;
