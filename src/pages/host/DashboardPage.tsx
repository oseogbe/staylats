import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Home, FileText, DollarSign, Users, Info, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/host/dashboard/MetricCard";
import { QuickAction } from "@/components/host/dashboard/QuickAction";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HostVerificationFormModal } from "@/components/host/HostVerificationFormModal";

import { useAuth } from "@/contexts/AuthContext";
import { useUserListings, useUserDrafts } from "@/hooks/use-listings";
import { useHostVerification } from "@/hooks/use-host-verification";
import { useNotifications } from "@/hooks/use-notifications";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from context (already cached)
  const queryClient = useQueryClient();
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const { needsVerification, hasHostProfile, isVerified, isRejected, rejectionReason, isLoading: verificationLoading } = useHostVerification();
  
  // Fetch listings with React Query (cached automatically)
  const { data: publishedListings = [], isLoading: listingsLoading } = useUserListings();
  const { data: drafts = [], isLoading: draftsLoading } = useUserDrafts();
  
  const currentTime = new Date();
  const greeting = currentTime.getHours() < 12 ? 'morning' : currentTime.getHours() < 18 ? 'afternoon' : 'evening';
  const userName = user?.firstName || 'Host';

  // Handle real-time notification updates for host verification
  const handleNotification = useCallback((notification: any) => {
    if (notification.type === 'host_verification_approved') {
      queryClient.setQueryData(['userProfile'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          hostProfile: {
            ...oldData.hostProfile,
            verified: true,
            status: 'approved'
          }
        };
      });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    } else if (notification.type === 'host_verification_rejected') {
      // Host profile status is already set to 'rejected' by backend
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    }
  }, [queryClient]);

  // Initialize WebSocket with notification callback
  useNotifications(user?.id || '', {
    onNotification: handleNotification
  });

  // Calculate property statistics using useMemo for performance
  const propertyStats = useMemo(() => {
    const total = publishedListings.length + drafts.length;
    const rentals = publishedListings.filter((l: any) => l.type === 'rental').length + 
                    drafts.filter((d: any) => d.type === 'rental').length;
    const shortlets = publishedListings.filter((l: any) => l.type === 'shortlet').length + 
                      drafts.filter((d: any) => d.type === 'shortlet').length;
    
    return {
      total,
      rentals,
      shortlets,
      subtitle: total === 0 
        ? 'No properties yet' 
        : `${rentals} ${rentals === 1 ? 'rental' : 'rentals'}, ${shortlets} ${shortlets === 1 ? 'shortlet' : 'shortlets'}`
    };
  }, [publishedListings, drafts]);

  // Clear verification alert when verified
  useEffect(() => {
    if (isVerified) {
      setShowVerificationAlert(false);
    }
  }, [isVerified]);

  // Show alert when data is loaded and user needs verification
  useEffect(() => {
    if (!listingsLoading && !draftsLoading && !verificationLoading) {
      const hasListings = publishedListings.length > 0 || drafts.length > 0;
      // Show alert if: has listings AND (needs verification OR is rejected)
      if (hasListings && !isVerified && (needsVerification || isRejected)) {
        setShowVerificationAlert(true);
      } else {
        setShowVerificationAlert(false);
      }
    }
  }, [publishedListings.length, drafts.length, needsVerification, isVerified, isRejected, listingsLoading, draftsLoading, verificationLoading]);

  // Handle successful verification submission
  const handleVerificationSubmitted = useCallback(() => {
    setShowFormModal(false);
  }, []);

  const handleCreateListing = () => {
    navigate("/host/create-listing");
  };

  const handleTabChange = (tab: string) => {
    navigate(`/host/${tab}`);
  };

  const handleVerifyHost = () => {
    setShowFormModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Greeting Section */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm text-neutral-600">
          <span>🕕 {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          <span>•</span>
          <span>{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <h2 className="text-2xl font-semibold text-neutral-900 flex items-center gap-2">
          Good {greeting}, {userName}
          {isVerified && (
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          )}
        </h2>
      </div>

      {/* Host Verification Alert */}
      {showVerificationAlert && !isVerified && (
        <Alert className={isRejected 
          ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800" 
          : hasHostProfile && !isVerified
          ? "bg-primary/10 border-primary/20 dark:bg-primary/5 dark:border-primary/30"
          : "bg-primary/10 border-primary/20 dark:bg-primary/5 dark:border-primary/30"
        }>
          <div className="flex items-start gap-3">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              isRejected 
                ? "bg-red-100 dark:bg-red-900/30" 
                : "bg-primary/20 dark:bg-primary/10"
            }`}>
              {isRejected ? (
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              ) : hasHostProfile && !isVerified ? (
                <Clock className="h-5 w-5 text-primary" />
              ) : (
                <Info className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <AlertDescription className="text-foreground">
                <div className="space-y-3">
                  <div>
                    <h3 className={`font-semibold text-base mb-1 ${
                      isRejected ? "text-red-900 dark:text-red-100" : "text-foreground"
                    }`}>
                      {isRejected
                        ? 'Host Verification Rejected'
                        : hasHostProfile && !isVerified 
                        ? 'Host Verification In Progress' 
                        : 'Ready for Host Verification'}
                    </h3>
                    <p className={`text-sm ${
                      isRejected 
                        ? "text-red-800 dark:text-red-200" 
                        : "text-muted-foreground"
                    }`}>
                      {isRejected
                        ? rejectionReason 
                          ? rejectionReason
                          : 'Your host verification request was rejected. Please resubmit with a clear and valid document.'
                        : hasHostProfile && !isVerified
                        ? 'Your host verification is currently under review. We will notify you once it\'s approved. This process typically takes 1-3 business days.'
                        : 'You have listed properties! Complete your host verification to unlock all features and ensure your listings can go live.'}
                    </p>
                  </div>
                  {(isRejected || !hasHostProfile) && (
                    <Button
                      onClick={handleVerifyHost}
                      className={isRejected
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                      }
                      size="sm"
                    >
                      {isRejected ? 'Resubmit Verification' : 'Verify Host Profile'}
                    </Button>
                  )}
                </div>
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}

      {/* Host Verification Form Modal */}
      <HostVerificationFormModal 
        open={showFormModal} 
        onOpenChange={setShowFormModal}
        onSuccess={handleVerificationSubmitted}
      />

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<Home />}
          title="Total Properties"
          value={propertyStats.total.toString()}
          subtitle={propertyStats.subtitle}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <MetricCard
          icon={<DollarSign />}
          title="Current Monthly Income"
          value="₦0"
          subtitle="From 0 active properties"
          bgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <MetricCard
          icon={<DollarSign />}
          title="Potential Income"
          value="₦0"
          subtitle="From all 3 properties"
          bgColor="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <MetricCard
          icon={<Users />}
          title="Occupancy Rate"
          value="0%"
          subtitle="No properties rented yet"
          bgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
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
            <QuickAction
              icon={<Home />}
              label="Add New Property"
              onClick={handleCreateListing}
              bgColor="bg-blue-50"
              textColor="text-blue-700"
              borderColor="border-blue-200"
            />
            <QuickAction
              icon={<FileText />}
              label="Manage Properties"
              onClick={() => handleTabChange("property-management")}
              bgColor="bg-gray-50"
              textColor="text-gray-700"
              borderColor="border-gray-200"
            />
            <QuickAction
              icon={<Users />}
              label="View Tenants"
              onClick={() => handleTabChange("tenant-management")}
              bgColor="bg-yellow-50"
              textColor="text-yellow-700"
              borderColor="border-yellow-200"
            />
            <QuickAction
              icon={<DollarSign />}
              label="View Finances"
              onClick={() => handleTabChange("finances")}
              bgColor="bg-green-50"
              textColor="text-green-700"
              borderColor="border-green-200"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
