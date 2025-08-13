import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PropertyListings from "./pages/PropertyListings";
import PropertyDetails from "./pages/PropertyDetails";
import SavedListings from "./pages/SavedListings";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import PhoneRegistration from "./pages/host/PhoneRegistration";
import OtpVerification from "./pages/host/OtpVerification";
import HostDetailsRegistration from "./pages/host/HostDetailsRegistration";
import CreateListingPrompt from "./pages/host/CreateListingPrompt";
import CreateRentalListing from "./pages/host/CreateRentalListing";
import CreateShortletListing from "./pages/host/CreateShortletListing";
import HostDashboard from "./pages/host/HostDashboard";
import MyAccount from "./pages/MyAccount";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/properties" element={<PropertyListings />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/saved-listings" element={<SavedListings />} />
          {/* Host onboarding routes */}
          <Route path="/host/phone-registration" element={<PhoneRegistration />} />
          <Route path="/host/verify-otp" element={<OtpVerification />} />
          <Route path="/host/register-details" element={<HostDetailsRegistration />} />
          <Route path="/host/create-listing-prompt" element={<CreateListingPrompt />} />
          <Route path="/host/create-rental-listing" element={<CreateRentalListing />} />
          <Route path="/host/create-shortlet-listing" element={<CreateShortletListing />} />
          <Route path="/host/dashboard" element={<HostDashboard />} />
          <Route path="/my-account" element={<MyAccount />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
