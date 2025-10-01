import { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  UserCircle, 
  ShieldCheck, 
  Wallet, 
  Bell, 
  Users, 
  ClipboardList 
} from 'lucide-react';

import { TabConfig } from '@/types/account';

interface MyAccountLayoutProps {
  children: ReactNode;
}

const MyAccountLayout = ({ children }: MyAccountLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract the current tab from the pathname
  const currentTab = location.pathname.split('/').pop() || 'account';

  const mainTabs: TabConfig[] = [
    { value: "profile", label: "Profile", icon: UserCircle, component: null as any },
    { value: "identification", label: "Identification", icon: ShieldCheck, component: null as any },
    { value: "bank-account", label: "Bank Account", icon: Wallet, component: null as any },
    { value: "communications", label: "Communications", icon: Bell, component: null as any },
    { value: "referrals", label: "Referrals", icon: Users, component: null as any },
    { value: "rental-request", label: "Rental Request", icon: ClipboardList, component: null as any },
  ];

  const handleTabChange = (value: string) => {
    navigate(`/my-account/${value}`);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Account</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
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

          <div className="space-y-6">
            {children}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default MyAccountLayout;
