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
import PhoneRegistration from "@/pages/host/PhoneRegistration";
import OtpVerification from "@/pages/host/OtpVerification";
import HostDetailsRegistration from "@/pages/host/HostDetailsRegistration";
import CreateListingPrompt from "@/pages/host/CreateListingPrompt";
import CreateRentalListing from "@/pages/host/CreateRentalListing";
import CreateShortletListing from "@/pages/host/CreateShortletListing";
import HostDashboard from "@/pages/host/HostDashboard";
import NotFound from "@/pages/NotFound";

import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

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

            {/* Host onboarding routes (accessible when not logged in) */}
            <Route
              path="/host/phone-registration"
              element={
                <ProtectedRoute requireAuth={false}>
                  <PhoneRegistration />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/verify-otp"
              element={
                <ProtectedRoute requireAuth={false}>
                  <OtpVerification />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/register-details"
              element={
                <ProtectedRoute requireAuth={false}>
                  <HostDetailsRegistration />
                </ProtectedRoute>
              }
            />

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

            {/* Protected routes for hosts only */}
            <Route
              path="/host/create-listing-prompt"
              element={
                <ProtectedRoute allowedRoles={['host']}>
                  <CreateListingPrompt />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/create-rental-listing"
              element={
                <ProtectedRoute allowedRoles={['host']}>
                  <CreateRentalListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/create-shortlet-listing"
              element={
                <ProtectedRoute allowedRoles={['host']}>
                  <CreateShortletListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/dashboard"
              element={
                <ProtectedRoute allowedRoles={['host']}>
                  <HostDashboard />
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
