import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountTab from '@/components/myaccount/account/AccountTab';
import IdentificationTab from '@/components/myaccount/identification/IdentificationTab';
import BankAccountTab from '@/components/myaccount/bankaccount/BankAccountTab';
import CommunicationsTab from '@/components/myaccount/communications/CommunicationsTab';
import ReferralsTab from '@/components/myaccount/referrals/ReferralsTab';
import RentalRequestTab from '@/components/myaccount/rentalrequest/RentalRequestTab';

import { TabConfig } from '@/types/account';

import { 
  UserCircle, 
  ShieldCheck, 
  Wallet, 
  Bell, 
  Users, 
  ClipboardList 
} from 'lucide-react';

export default function MyAccount() {
  const [activeTab, setActiveTab] = useState("account");

  const mainTabs: TabConfig[] = [
    { value: "account", label: "Account", icon: UserCircle, component: AccountTab },
    { value: "identification", label: "Identification", icon: ShieldCheck, component: IdentificationTab },
    { value: "bank-account", label: "Bank Account", icon: Wallet, component: BankAccountTab },
    { value: "communications", label: "Communications", icon: Bell, component: CommunicationsTab },
    { value: "referrals", label: "Referrals", icon: Users, component: ReferralsTab },
    { value: "rental-request", label: "Rental Request", icon: ClipboardList, component: RentalRequestTab },
  ];
  
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Account</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-1 bg-muted p-1">
            {mainTabs.map((tab) => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value}
                className="flex items-center gap-2 text-xs lg:text-sm"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {mainTabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="space-y-6">
              <tab.component />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}