import { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, FileText, DollarSign, Users, MessageSquare } from 'lucide-react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HostDashboardLayoutProps {
  children: ReactNode;
}

const HostDashboardLayout = ({ children }: HostDashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract the current tab from the pathname
  const currentTab = location.pathname.split('/').pop() || 'dashboard';

  const mainTabs = [
    { value: "dashboard", label: "Dashboard", icon: Home },
    { value: "property-management", label: "Property Management", icon: FileText },
    { value: "finances", label: "Finances", icon: DollarSign },
    { value: "tenant-management", label: "Tenant Management", icon: Users },
    { value: "rental-applications", label: "Rental Applications", icon: MessageSquare },
  ];

  const handleTabChange = (value: string) => {
    // Navigate to the new tab route using React Router
    navigate(`/host/${value}`);
  };
  
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
          <Tabs value={currentTab} onValueChange={handleTabChange}>
            <TabsList className="bg-transparent border-none h-auto p-0 space-x-8">
              {mainTabs.map((tab) => (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none py-4 px-0"
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
};

export default HostDashboardLayout;
