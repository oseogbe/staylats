import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Building2, CheckCircle, Plus, ArrowRight } from 'lucide-react';

export default function CreateListingPrompt() {
  const navigate = useNavigate();

  const handleCreateListing = (type: 'rental' | 'shortlet') => {
    if (type === 'rental') {
      navigate('/host/create-rental-listing');
    } else {
      navigate('/host/create-shortlet-listing');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl">Welcome to Hosting!</CardTitle>
          <CardDescription className="text-lg">
            Your account is ready. Now let's create your first listing to start earning.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">What would you like to list?</h3>
            <p className="text-muted-foreground mb-6">
              Choose the type of property you want to list on our platform.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="cursor-pointer border-2 hover:border-primary transition-colors">
              <CardContent className="p-6" onClick={() => handleCreateListing('rental')}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Home className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Long-term Rental</h4>
                    <p className="text-sm text-muted-foreground">
                      List apartments, houses, or rooms for monthly rentals
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Rental Listing
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer border-2 hover:border-primary transition-colors">
              <CardContent className="p-6" onClick={() => handleCreateListing('shortlet')}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <Building2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Short-term Shortlet</h4>
                    <p className="text-sm text-muted-foreground">
                      List properties for daily or weekly stays
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Shortlet Listing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              Not ready to create a listing yet?
            </p>
            <Button variant="ghost" onClick={() => navigate('/')}>
              Skip for now
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}