import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const BankAccountTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bank Account</CardTitle>
        <CardDescription>
          Manage your bank account information for payments and withdrawals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Bank account management coming soon...</p>
      </CardContent>
    </Card>
  );
};

export default BankAccountTab;