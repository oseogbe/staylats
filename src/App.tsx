import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/lib/queryClient";
import { Toaster } from "react-hot-toast";

import Index from "@/pages/Index";
import MyAccount from "@/pages/MyAccount";
import PropertyListings from "@/pages/PropertyListings";
import PropertyDetails from "@/pages/PropertyDetails";
import SavedListings from "@/pages/SavedListings";
import EmailVerification from "@/pages/EmailVerification";
import ResendEmailVerification from "@/pages/ResendEmailVerification";
import OAuthCallback from "@/pages/OAuthCallback";
import LinkOAuthAccount from "@/pages/LinkOAuthAccount";
import AuthOnboarding from "@/pages/AuthOnboarding";
import { CreateListingPromptModal } from "@/pages/host/CreateListingPrompt";
import CreateRentalListing from "@/pages/host/CreateRentalListing";
import CreateShortletListing from "@/pages/host/CreateShortletListing";
import NotFound from "@/pages/NotFound";

// MyAccount pages
import ProfilePage from "@/pages/myaccount/ProfilePage";
import IdentificationPage from "@/pages/myaccount/IdentificationPage";
import BankAccountPage from "@/pages/myaccount/BankAccountPage";
import CommunicationsPage from "@/pages/myaccount/CommunicationsPage";
import ReferralsPage from "@/pages/myaccount/ReferralsPage";
import ReservationsPage from "@/pages/myaccount/ReservationsPage";

// Layouts
import MyAccountLayout from "@/components/layouts/MyAccountLayout";
import HostDashboardLayout from "@/components/layouts/HostDashboardLayout";

// Host Dashboard pages
import DashboardPage from "@/pages/host/DashboardPage";
import PropertyManagementPage from "@/pages/host/PropertyManagementPage";
import FinancesPage from "@/pages/host/FinancesPage";
import TenantManagementPage from "@/pages/host/TenantManagementPage";
import BookingsPage from "@/pages/host/BookingsPage";
import RentalApplicationsPage from "@/pages/host/RentalApplicationsPage";
import ShortletBookingConfirmation from "@/pages/shortlet/ShortletBookingConfirmation";

import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "@/contexts/AuthContext";
import { CreateListingPromptProvider } from "@/contexts/CreateListingPromptContext";

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
          <CreateListingPromptProvider>
            <ScrollToTop />
            <Navbar />
            <CreateListingPromptModal />
            <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/properties" element={<PropertyListings />} />
            <Route path="/property/:slug" element={<PropertyDetails />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/resend-verification" element={<ResendEmailVerification />} />
            <Route path="/auth/oauth-callback" element={<OAuthCallback />} />
            <Route path="/auth/link-account" element={<LinkOAuthAccount />} />
            <Route
              path="/auth/onboarding"
              element={
                <ProtectedRoute allowedRoles={['host', 'tenant', 'visitor']} requireAuth>
                  <AuthOnboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings/shortlet/confirmation"
              element={
                <ProtectedRoute allowedRoles={['host', 'tenant', 'visitor']} requirePhoneVerified>
                  <ShortletBookingConfirmation />
                </ProtectedRoute>
              }
            />
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
            <Route
              path="/my-account/reservations"
              element={
                <ProtectedRoute allowedRoles={['host', 'tenant', 'visitor']}>
                  <MyAccountLayout>
                    <ReservationsPage />
                  </MyAccountLayout>
                </ProtectedRoute>
              }
            />

            {/* Protected routes for hosts only */}
            <Route
              path="/host/create-rental-listing"
              element={
                <ProtectedRoute allowedRoles={['host', 'tenant', 'visitor']} requirePhoneVerified>
                  <CreateRentalListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/create-shortlet-listing"
              element={
                <ProtectedRoute allowedRoles={['host', 'tenant', 'visitor']} requirePhoneVerified>
                  <CreateShortletListing />
                </ProtectedRoute>
              }
            />
            
            {/* HostDashboard sub-routes with shared layout */}
            <Route
              path="/host/dashboard"
              element={
                <ProtectedRoute allowedRoles={['host', 'tenant', 'visitor']} requirePhoneVerified>
                  <HostDashboardLayout>
                    <DashboardPage />
                  </HostDashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/property-management"
              element={
                <ProtectedRoute allowedRoles={['host', 'tenant', 'visitor']} requirePhoneVerified>
                  <HostDashboardLayout>
                    <PropertyManagementPage />
                  </HostDashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/bookings"
              element={
                <ProtectedRoute allowedRoles={['host', 'tenant', 'visitor']} requirePhoneVerified>
                  <HostDashboardLayout>
                    <BookingsPage />
                  </HostDashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/finances"
              element={
                <ProtectedRoute allowedRoles={['host', 'tenant', 'visitor']} requirePhoneVerified>
                  <HostDashboardLayout>
                    <FinancesPage />
                  </HostDashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/tenant-management"
              element={
                <ProtectedRoute allowedRoles={['host', 'tenant', 'visitor']} requirePhoneVerified>
                  <HostDashboardLayout>
                    <TenantManagementPage />
                  </HostDashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/rental-applications"
              element={
                <ProtectedRoute allowedRoles={['host', 'tenant', 'visitor']} requirePhoneVerified>
                  <HostDashboardLayout>
                    <RentalApplicationsPage />
                  </HostDashboardLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
          </CreateListingPromptProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
