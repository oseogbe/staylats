import { Home, Trash2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { PropertyListing } from "../types";

interface PropertyCardProps {
  listing: PropertyListing;
  onContinue: (listing: PropertyListing) => void;
}

export function PropertyCard({ listing, onContinue }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] bg-neutral-200 relative">
        {/* Status Badges */}
        {listing.status === "draft" && (
          <Badge className="absolute top-3 left-3 bg-orange-100 text-orange-800 hover:bg-orange-100">
            In progress
          </Badge>
        )}
        {listing.status === "pending" && (
          <Badge className="absolute top-3 left-3 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending Approval
          </Badge>
        )}
        {listing.status === "approved" && (
          <Badge className="absolute top-3 left-3 bg-green-100 text-green-800 hover:bg-green-100">
            Approved
          </Badge>
        )}
        {listing.status === "rejected" && (
          <Badge className="absolute top-3 left-3 bg-red-100 text-red-800 hover:bg-red-100">
            Rejected
          </Badge>
        )}
        {listing.images && listing.images.length > 0 ? (
          <img 
            src={listing.images[0]} 
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Home className="w-12 h-12 text-neutral-400" />
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-medium text-neutral-900">{listing.title}</h3>
            <p className="text-sm text-neutral-600 capitalize">{listing.type}</p>
          </div>

          {listing.status === "draft" && listing.stepsRemaining && (
            <p className="text-sm text-neutral-600">{listing.stepsRemaining} {listing.stepsRemaining === 1 ? 'step' : 'steps'} remaining</p>
          )}

          <p className="text-xs text-neutral-500">{listing.lastUpdated}</p>

          <div className="flex items-center justify-between pt-2">
            {listing.status !== "pending" && (
              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 p-0">
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            {listing.status === "draft" && (
              <Button 
                size="sm" 
                onClick={() => onContinue(listing)}
                className="bg-primary hover:bg-primary-hover"
              >
                Continue
              </Button>
            )}
            {(["approved", "rejected"].includes(listing.status)) && (
              <Button variant="outline" size="sm">
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
