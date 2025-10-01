import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const RentalRequestPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rental Request</CardTitle>
        <CardDescription>
          View and manage your rental requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Rental requests coming soon...</p>
      </CardContent>
    </Card>
  );
};

export default RentalRequestPage;
