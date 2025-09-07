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
        {listing.status === "draft" && (
          <Badge className="absolute top-3 left-3 bg-orange-100 text-orange-800 hover:bg-orange-100">
            In progress
          </Badge>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <Home className="w-12 h-12 text-neutral-400" />
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-medium text-neutral-900">{listing.title}</h3>
            <p className="text-sm text-neutral-600 capitalize">{listing.type} in</p>
          </div>

          {listing.status === "draft" && listing.stepsRemaining && (
            <p className="text-sm text-neutral-600">{listing.stepsRemaining} steps remaining</p>
          )}

          <p className="text-xs text-neutral-500">Updated {listing.lastUpdated}</p>

          <div className="flex items-center justify-between pt-2">
            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 p-0">
              <Trash2 className="w-4 h-4" />
            </Button>
            
            {listing.status === "draft" ? (
              <Button 
                size="sm" 
                onClick={() => onContinue(listing)}
                className="bg-primary hover:bg-primary-hover"
              >
                Continue
              </Button>
            ) : (
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
