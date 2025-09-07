import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TenantTabProps {
  onManageProperties: () => void;
}

export function TenantTab({ onManageProperties }: TenantTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900">Tenant Management</h2>
        <p className="text-neutral-600 mt-1">
          Manage your tenants and their rental agreements. You can view details about each tenant, 
          including their contact information and rental history.
        </p>
      </div>

      <Card>
        <CardContent className="py-16">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Tenants found!</h3>
            <p className="text-neutral-600 mb-6">You don't have any tenants renting your properties yet.</p>
            <Button 
              onClick={onManageProperties}
              className="bg-primary hover:bg-primary-hover"
            >
              Manage Your Properties
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
