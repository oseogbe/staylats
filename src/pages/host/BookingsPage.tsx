import { CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BookingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900">Bookings</h2>
        <p className="text-neutral-600 mt-1">
          View and manage bookings for your shortlet listings.
        </p>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="bg-neutral-100">
          <TabsTrigger value="all" className="data-[state=active]:bg-white">
            All
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-white">
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-white">
            Active
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-white">
            Completed
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="data-[state=active]:bg-white">
            Cancelled
          </TabsTrigger>
        </TabsList>

        {["all", "upcoming", "active", "completed", "cancelled"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{tab === "all" ? "All Bookings" : `${tab} Bookings`}</CardTitle>
                <CardDescription>
                  {tab === "all"
                    ? "A complete list of all bookings across your shortlet listings."
                    : `Bookings that are currently ${tab}.`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="mx-auto w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                    <CalendarDays className="w-6 h-6 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    No {tab === "all" ? "" : `${tab} `}bookings yet
                  </h3>
                  <p className="text-neutral-600">
                    Bookings will appear here once guests start booking your shortlet listings.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default BookingsPage;
