import { DollarSign } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FinanceTab() {
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-neutral-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-neutral-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Available Balance</p>
                <p className="text-2xl font-bold text-neutral-900">₦0.00</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                View Wallet
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary-hover">
                Withdraw
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Account Warning */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-yellow-800 mb-1">No Bank Account Connected</h3>
              <p className="text-sm text-yellow-700 mb-3">
                Add a bank account to receive payouts from your rental properties
              </p>
              <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
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
}
