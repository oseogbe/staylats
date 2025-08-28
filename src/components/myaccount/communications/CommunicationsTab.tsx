import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CommunicationsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Communications</CardTitle>
        <CardDescription>
          Manage your communication preferences and notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Communication settings coming soon...</p>
      </CardContent>
    </Card>
  );
};

export default CommunicationsTab;