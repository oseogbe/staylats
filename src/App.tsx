import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import Index from "@/pages/Index";
import MyAccount from "@/pages/MyAccount";
import PropertyListings from "@/pages/PropertyListings";
import PropertyDetails from "@/pages/PropertyDetails";
import SavedListings from "@/pages/SavedListings";
import EmailVerification from "@/pages/EmailVerification";
import ResendEmailVerification from "@/pages/ResendEmailVerification";
import CreateListingPrompt from "@/pages/host/CreateListingPrompt";
import CreateRentalListing from "@/pages/host/CreateRentalListing";
import CreateShortletListing from "@/pages/host/CreateShortletListing";
import NotFound from "@/pages/NotFound";

// MyAccount pages
import ProfilePage from "@/pages/myaccount/ProfilePage";
import IdentificationPage from "@/pages/myaccount/IdentificationPage";
import BankAccountPage from "@/pages/myaccount/BankAccountPage";
import CommunicationsPage from "@/pages/myaccount/CommunicationsPage";
import ReferralsPage from "@/pages/myaccount/ReferralsPage";

// Layouts
import MyAccountLayout from "@/components/layouts/MyAccountLayout";
import HostDashboardLayout from "@/components/layouts/HostDashboardLayout";

// Host Dashboard pages
import DashboardPage from "@/pages/host/DashboardPage";
import PropertyManagementPage from "@/pages/host/PropertyManagementPage";
import FinancesPage from "@/pages/host/FinancesPage";
import TenantManagementPage from "@/pages/host/TenantManagementPage";
import RentalApplicationsPage from "@/pages/host/RentalApplicationsPage";

import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "@/contexts/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes default
      gcTime: 10 * 60 * 1000, // 10 minutes default (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false, // Don't refetch on window focus to reduce unnecessary calls
      refetchOnMount: true, // Refetch on mount if data is stale
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          success: {
            duration: 3000,
          },
          error: {
            duration: 4000,
          },
        }}
      />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Navbar />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/properties" element={<PropertyListings />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/resend-verification" element={<ResendEmailVerification />} />
            <Route path="*" element={<NotFound />} />

            {/* Protected routes for authenticated users */}
            <Route
              path="/saved-listings"
              element={
                <ProtectedRoute allowedRoles={['host', 'tenant', 'visitor']}>
                  <SavedListings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-account"
              element={
                <ProtectedRoute allowedRoles={['host', 'tenant', 'visitor']}>
                  <MyAccount />
                </ProtectedRoute>
              }
            />
            
            {/* MyAccount sub-routes with shared layout */}
            <Route
              path="/my-account/profile"
              element={
                <ProtectedRoute allowedRoles={['host', 'tenant', 'visitor']}>
                  <MyAccountLayout>
                    <ProfilePage />
                  </MyAccountLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-account/identification"
              element={
                <ProtectedRoute allowedRoles={['host', 'tenant', 'visitor']}>
                  <MyAccountLayout>
                    <IdentificationPage />
                  </MyAccountLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-account/bank-account"
              element={
                <ProtectedRoute allowedRoles={['host', 'tenant', 'visitor']}>
                  <MyAccountLayout>
                    <BankAccountPage />
                  </MyAccountLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-account/communications"
              element={
                <ProtectedRoute allowedRoles={['host', 'tenant', 'visitor']}>
                  <MyAccountLayout>
                    <CommunicationsPage />
                  </MyAccountLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-account/referrals"
              element={
                <ProtectedRoute allowedRoles={['host', 'tenant', 'visitor']}>
                  <MyAccountLayout>
                    <ReferralsPage />
                  </MyAccountLayout>
                </ProtectedRoute>
              }
            />

            {/* Protected routes for hosts only */}
            <Route
              path="/host/create-listing"
              element={
                <ProtectedRoute allowedRoles={['host', 'tenant', 'visitor']}>
                  <CreateListingPrompt />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/create-rental-listing"
              element={
                <ProtectedRoute allowedRoles={['host', 'tenant', 'visitor']}>
                  <CreateRentalListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/create-shortlet-listing"
              element={
                <ProtectedRoute allowedRoles={['host', 'tenant', 'visitor']}>
                  <CreateShortletListing />
                </ProtectedRoute>
              }
            />
            
            {/* HostDashboard sub-routes with shared layout */}
            <Route
              path="/host/dashboard"
              element={
                <ProtectedRoute allowedRoles={['host', 'tenant', 'visitor']}>
                  <HostDashboardLayout>
                    <DashboardPage />
                  </HostDashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/property-management"
              element={
                <ProtectedRoute allowedRoles={['host', 'tenant', 'visitor']}>
                  <HostDashboardLayout>
                    <PropertyManagementPage />
                  </HostDashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/finances"
              element={
                <ProtectedRoute allowedRoles={['host', 'tenant', 'visitor']}>
                  <HostDashboardLayout>
                    <FinancesPage />
                  </HostDashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/tenant-management"
              element={
                <ProtectedRoute allowedRoles={['host', 'tenant', 'visitor']}>
                  <HostDashboardLayout>
                    <TenantManagementPage />
                  </HostDashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/rental-applications"
              element={
                <ProtectedRoute allowedRoles={['host', 'tenant', 'visitor']}>
                  <HostDashboardLayout>
                    <RentalApplicationsPage />
                  </HostDashboardLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
