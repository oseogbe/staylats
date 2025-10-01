import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ReferralsPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Referrals</CardTitle>
        <CardDescription>
          Refer friends and earn rewards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Referral program coming soon...</p>
      </CardContent>
    </Card>
  );
};

export default ReferralsPage;
