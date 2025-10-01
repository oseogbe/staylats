import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

const IdentificationPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Identity Verification</CardTitle>
        <CardDescription>
          We need to verify your identity to ensure a secure and trustworthy rental experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
            <User className="h-8 w-8 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Individual</h3>
            <p className="text-sm text-muted-foreground">
              Verify your identity as an individual using government-issued ID
            </p>
          </Card>
          <Card className="p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
            <User className="h-8 w-8 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Company</h3>
            <p className="text-sm text-muted-foreground">
              Verify your business using CAC registration documents
            </p>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default IdentificationPage;
