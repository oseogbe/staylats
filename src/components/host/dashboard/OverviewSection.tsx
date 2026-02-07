import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { OverviewListingItem } from "@/hooks/use-overview-listings";

interface OverviewSectionProps {
  items: OverviewListingItem[];
  isLoading: boolean;
  isError: boolean;
}

export function OverviewSection({
  items,
  isLoading,
  isError,
}: OverviewSectionProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>
            A summary of your properties including bookings and earnings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12 text-neutral-500">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            <span>Loading overview…</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>
            A summary of your properties including bookings and earnings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-neutral-600">
            <p>Unable to load overview. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>
            A summary of your properties including bookings and earnings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-neutral-600">No property data available</p>
            <p className="text-sm text-neutral-500 mt-1">
              Add properties to view your overview
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <CardDescription>
          A summary of your top properties including bookings and current
          earnings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Bookings</TableHead>
              <TableHead className="text-right">Current earnings</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium max-w-[260px] truncate">
                  {item.title}
                </TableCell>
                <TableCell className="capitalize">{item.type}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {item.bookings}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  ₦{item.currentEarnings.toLocaleString("en-NG", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
