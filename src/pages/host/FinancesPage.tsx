import { DollarSign } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FinancesPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900">Finance Management</h2>
        <p className="text-neutral-600 mt-1">Manage your property financials and view transaction history</p>
      </div>

      {/* Wallet Balance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Wallet Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="shrink-0 rounded-lg bg-neutral-100 p-2">
                <DollarSign className="h-5 w-5 text-neutral-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-neutral-600">Available Balance</p>
                <p className="text-2xl font-bold text-neutral-900">₦0.00</p>
              </div>
            </div>
            <div className="flex w-full shrink-0 flex-col gap-2 sm:flex-row sm:justify-end md:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                View Wallet
              </Button>
              <Button size="sm" className="w-full bg-primary hover:bg-primary-hover sm:w-auto">
                Withdraw
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Account Warning */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="shrink-0 rounded-lg bg-yellow-100 p-2">
              <DollarSign className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="mb-1 font-medium text-yellow-800">No Bank Account Connected</h3>
              <p className="mb-3 text-sm text-yellow-700">
                Add a bank account to receive payouts from your rental properties
              </p>
              <Button size="sm" className="w-full bg-yellow-600 text-white hover:bg-yellow-700 sm:w-auto">
                Add Bank Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties with Payments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Properties with Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="mx-auto w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Properties with Payments found!</h3>
            <p className="text-neutral-600 mb-2">
              You don't have any properties with active rental agreements yet. <br />Add properties and secure tenants to start receiving payments.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancesPage;
