import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, FileText, DollarSign, Users, MessageSquare } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  OverviewTab,
  PropertyManagementTab,
  FinanceTab,
  TenantTab,
  RentalResponsesTab,
  type PropertyListing
} from "@/components/host";
import listingsService, { type DraftSummary } from "@/services/listings";

const mockListings: PropertyListing[] = [];

export default function HostDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("property-management");
  const [draftListings, setDraftListings] = useState<PropertyListing[]>(mockListings);

  const publishedListings = mockListings.filter(listing => listing.status === "published");

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
    (async () => {
      try {
        const data = await listingsService.getDrafts();
        const mapped: PropertyListing[] = data.drafts.map((d: DraftSummary) => ({
          id: d.id,
          title: d.title,
          type: d.type,
          status: 'draft',
          stepsRemaining: d.stepsRemaining,
          lastUpdated: new Date(d.lastUpdated).toLocaleString()
        }));
        setDraftListings(mapped);
      } catch (err) {
        // silently ignore or add toast later
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900">Host Dashboard</h1>
              <p className="text-neutral-600 mt-1">Manage your properties and bookings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-transparent border-none h-auto p-0 space-x-8">
              <TabsTrigger 
                value="dashboard" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none py-4 px-0"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="property-management"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none py-4 px-0"
              >
                <FileText className="w-4 h-4 mr-2" />
                Property Management
              </TabsTrigger>
              <TabsTrigger 
                value="finance"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none py-4 px-0"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Finance Management
              </TabsTrigger>
              <TabsTrigger 
                value="tenant"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none py-4 px-0"
              >
                <Users className="w-4 h-4 mr-2" />
                Tenant Management
              </TabsTrigger>
              <TabsTrigger 
                value="responses"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none py-4 px-0"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Rental Responses
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="dashboard">
            <OverviewTab onCreateListing={handleCreateListing} onTabChange={setActiveTab} />
          </TabsContent>

          <TabsContent value="property-management">
            <PropertyManagementTab
              publishedListings={publishedListings}
              draftListings={draftListings}
              onCreateListing={handleCreateListing}
              onContinueListing={handleContinueListing}
            />
          </TabsContent>

          <TabsContent value="finance">
            <FinanceTab />
          </TabsContent>

          <TabsContent value="tenant">
            <TenantTab onManageProperties={() => setActiveTab("property-management")} />
          </TabsContent>

          <TabsContent value="responses">
            <RentalResponsesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}