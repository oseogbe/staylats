import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useCreateListingPrompt } from "@/contexts/CreateListingPromptContext";

import { Home, CheckCircle, Plus, BedDouble } from "lucide-react";

export function CreateListingPromptModal() {
  const navigate = useNavigate();
  const { open, closePrompt } = useCreateListingPrompt();

  const handleCreateListing = (type: "rental" | "shortlet") => {
    if (type === "rental") {
      navigate("/host/create-rental-listing");
    } else {
      navigate("/host/create-shortlet-listing");
    }
    closePrompt();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) closePrompt();
      }}
    >
      <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto p-6 sm:p-8">
        <DialogHeader className="flex flex-col items-center space-y-1.5 text-center sm:text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl sm:text-3xl">
            What would you like to list?
          </DialogTitle>
          <DialogDescription className="text-center text-base sm:text-lg">
            Choose the type of property you want to list on our platform.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="cursor-pointer border-2">
            <CardContent className="p-6" onClick={() => handleCreateListing("rental")}>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Rentals</h4>
                  <p className="text-sm text-muted-foreground">
                    List apartments, houses, or rooms for monthly rentals
                  </p>
                </div>
                <Button variant="outline" className="w-full" type="button">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Rental Listing
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer border-2">
            <CardContent className="p-6" onClick={() => handleCreateListing("shortlet")}>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <BedDouble className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Shortlets</h4>
                  <p className="text-sm text-muted-foreground">
                    List properties for daily or weekly vacational stays
                  </p>
                </div>
                <Button variant="outline" className="w-full" type="button">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Shortlet Listing
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
