import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PersonalInfoForm from './PersonalInfoForm';
import PasswordForm from './PasswordForm';

import { UserData } from '@/types/account';

const AccountTab = () => {
  const [activeSubTab, setActiveSubTab] = useState("personal-info");
  
  // Mock user data - in real app this would come from context/API
  const [userData, setUserData] = useState<UserData>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+2348123456789',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    avatar: '',
    accountStatus: 'ACTIVE ACCOUNT'
  });

  return (
    <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>

      <TabsContent value="personal-info" className="space-y-6">
        <PersonalInfoForm userData={userData} setUserData={setUserData} />
      </TabsContent>

      <TabsContent value="password" className="space-y-6">
        <PasswordForm />
      </TabsContent>
    </Tabs>
  );
};

export default AccountTab;