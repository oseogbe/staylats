import { useNavigate } from "react-router-dom";
import { Home, FileText, DollarSign, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/host/dashboard/MetricCard";
import { QuickAction } from "@/components/host/dashboard/QuickAction";

const DashboardPage = () => {
  const navigate = useNavigate();
  
  const currentTime = new Date();
  const greeting = currentTime.getHours() < 12 ? 'morning' : currentTime.getHours() < 18 ? 'afternoon' : 'evening';

  const handleCreateListing = () => {
    navigate("/host/create-listing");
  };

  const handleTabChange = (tab: string) => {
    navigate(`/host/${tab}`);
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
        <h2 className="text-2xl font-semibold text-neutral-900">
          Good {greeting}, Host
        </h2>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<Home />}
          title="Total Properties"
          value="3"
          subtitle="2 rentals, 1 shortlet"
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
              onClick={() => handleTabChange("tenant")}
              bgColor="bg-yellow-50"
              textColor="text-yellow-700"
              borderColor="border-yellow-200"
            />
            <QuickAction
              icon={<DollarSign />}
              label="View Finances"
              onClick={() => handleTabChange("finance")}
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
