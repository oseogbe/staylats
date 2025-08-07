import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Home, FileText, DollarSign, Users, MessageSquare, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface PropertyListing {
  id: string
  title: string
  type: "rental" | "shortlet"
  status: "published" | "draft"
  stepsRemaining?: number
  lastUpdated: string
  image?: string
}

const mockListings: PropertyListing[] = [
  {
    id: "1",
    title: "Unnamed Property",
    type: "rental",
    status: "draft",
    stepsRemaining: 3,
    lastUpdated: "Apr 19, 2025 at 7:43 PM"
  },
  {
    id: "2", 
    title: "Unnamed Property",
    type: "shortlet",
    status: "draft",
    stepsRemaining: 2,
    lastUpdated: "Apr 19, 2025 at 7:09 PM"
  },
  {
    id: "3",
    title: "Unnamed Property", 
    type: "rental",
    status: "draft",
    stepsRemaining: 5,
    lastUpdated: "Apr 4, 2025 at 7:18 AM"
  }
]

const HostDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("property-management")
  const [listingTab, setListingTab] = useState("drafts")

  const publishedListings = mockListings.filter(listing => listing.status === "published")
  const draftListings = mockListings.filter(listing => listing.status === "draft")

  const handleCreateListing = () => {
    navigate("/host/create-listing-prompt")
  }

  const handleContinueListing = (listing: PropertyListing) => {
    // Navigate based on listing type
    if (listing.type === "rental") {
      navigate("/host/create-rental-listing")
    } else {
      navigate("/host/create-shortlet-listing")
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-6 py-4">
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
        <div className="container mx-auto px-6">
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
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="property-management" className="space-y-6">
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
                      <p className="text-neutral-600 mb-6">Start creating your property listing to see drafts here.</p>
                      <Button onClick={handleCreateListing} className="bg-primary hover:bg-primary-hover">
                        Add New Listing
                      </Button>
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
          </TabsContent>

          {/* Dashboard Tab Content */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Greeting Section */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-neutral-600">
                <span>🕕 {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                <span>•</span>
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <h2 className="text-2xl font-semibold text-neutral-900">
                Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, Host
              </h2>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Home className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Total Properties</p>
                      <p className="text-2xl font-bold text-neutral-900">3</p>
                      <p className="text-xs text-neutral-500">2 rentals, 1 shortlet</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Current Monthly Income</p>
                      <p className="text-2xl font-bold text-neutral-900">₦0</p>
                      <p className="text-xs text-neutral-500">From 0 active properties</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Potential Income</p>
                      <p className="text-2xl font-bold text-neutral-900">₦0</p>
                      <p className="text-xs text-neutral-500">From all 3 properties</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Occupancy Rate</p>
                      <p className="text-2xl font-bold text-neutral-900">0%</p>
                      <p className="text-xs text-neutral-500">No properties rented yet</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Overview Section */}
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>A summary of your properties including current and potential earnings.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-neutral-600">No property data available</p>
                  <p className="text-sm text-neutral-500 mt-1">Add properties to view your financial overview</p>
                </div>
              </CardContent>
            </Card>

            {/* Property Overview and Tenants/Guests Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Property Overview</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary-hover">
                    View all
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-neutral-600">No properties found. Add properties to get started!</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Tenants & Guests</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary-hover">
                    View all
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-neutral-600">No tenants or guests found</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Payouts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Payouts</CardTitle>
                <CardDescription>Latest rent and booking payouts received from your properties</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-neutral-600">No recent payouts recorded</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button 
                    onClick={handleCreateListing}
                    className="h-16 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 flex flex-col items-center justify-center space-y-1"
                    variant="outline"
                  >
                    <Home className="w-5 h-5" />
                    <span className="text-sm">Add New Property</span>
                  </Button>
                  
                  <Button 
                    onClick={() => setActiveTab("property-management")}
                    className="h-16 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 flex flex-col items-center justify-center space-y-1"
                    variant="outline"
                  >
                    <FileText className="w-5 h-5" />
                    <span className="text-sm">Manage Properties</span>
                  </Button>
                  
                  <Button 
                    onClick={() => setActiveTab("tenant")}
                    className="h-16 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 flex flex-col items-center justify-center space-y-1"
                    variant="outline"
                  >
                    <Users className="w-5 h-5" />
                    <span className="text-sm">View Tenants</span>
                  </Button>
                  
                  <Button 
                    onClick={() => setActiveTab("finance")}
                    className="h-16 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 flex flex-col items-center justify-center space-y-1"
                    variant="outline"
                  >
                    <DollarSign className="w-5 h-5" />
                    <span className="text-sm">View Finances</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finance" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">Finance Management</h2>
              <p className="text-neutral-600 mt-1">Manage your property financials and view transaction history</p>
            </div>

            {/* Wallet Balance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Wallet Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-neutral-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Available Balance</p>
                      <p className="text-2xl font-bold text-neutral-900">₦0.00</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View Wallet
                    </Button>
                    <Button size="sm" className="bg-primary hover:bg-primary-hover">
                      Withdraw
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bank Account Warning */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-yellow-800 mb-1">No Bank Account Connected</h3>
                    <p className="text-sm text-yellow-700 mb-3">
                      Add a bank account to receive payouts from your rental properties
                    </p>
                    <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                      Add Bank Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Properties with Payments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Properties with Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="mx-auto w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                    <DollarSign className="w-6 h-6 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Properties with Payments found!</h3>
                  <p className="text-neutral-600 mb-2">
                    You don't have any properties with active rental
                  </p>
                  <p className="text-neutral-600 mb-6">
                    agreements yet. Add properties and secure tenants to start receiving payments.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tenant" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">Tenant Management</h2>
              <p className="text-neutral-600 mt-1">Manage your tenants and their rental agreements. You can view details about each tenant, including their contact information and rental history.</p>
            </div>

            <Card>
              <CardContent className="py-16">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Tenants found!</h3>
                  <p className="text-neutral-600 mb-6">You don't have any tenants renting your properties yet.</p>
                  <Button 
                    onClick={() => setActiveTab("property-management")}
                    className="bg-primary hover:bg-primary-hover"
                  >
                    Manage Your Properties
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="responses">
            <Card>
              <CardHeader>
                <CardTitle>Rental Responses</CardTitle>
                <CardDescription>View and manage rental applications and inquiries</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600">Rental responses content coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface PropertyCardProps {
  listing: PropertyListing
  onContinue: (listing: PropertyListing) => void
}

const PropertyCard = ({ listing, onContinue }: PropertyCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] bg-neutral-200 relative">
        {listing.status === "draft" && (
          <Badge className="absolute top-3 left-3 bg-orange-100 text-orange-800 hover:bg-orange-100">
            In progress
          </Badge>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <Home className="w-12 h-12 text-neutral-400" />
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-medium text-neutral-900">{listing.title}</h3>
            <p className="text-sm text-neutral-600 capitalize">{listing.type} in</p>
          </div>

          {listing.status === "draft" && listing.stepsRemaining && (
            <p className="text-sm text-neutral-600">{listing.stepsRemaining} steps remaining</p>
          )}

          <p className="text-xs text-neutral-500">Updated {listing.lastUpdated}</p>

          <div className="flex items-center justify-between pt-2">
            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 p-0">
              <Trash2 className="w-4 h-4" />
            </Button>
            
            {listing.status === "draft" ? (
              <Button 
                size="sm" 
                onClick={() => onContinue(listing)}
                className="bg-primary hover:bg-primary-hover"
              >
                Continue
              </Button>
            ) : (
              <Button variant="outline" size="sm">
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default HostDashboard
