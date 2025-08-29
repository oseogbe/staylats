import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PersonalInfoForm from './PersonalInfoForm';
import PasswordForm from './PasswordForm';

import profileAPI from '@/services/profile';
import { useAuth } from '@/contexts/AuthContext';
import { UserData, PersonalInfoFormData } from '@/types/account';

const AccountTab = () => {
  const [activeSubTab, setActiveSubTab] = useState("personal-info");
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser } = useAuth();
  
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: new Date(),
    gender: '',
    image: '',
    role: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await profileAPI.getCurrentUser();
        const { user } = response.data;
        
        setUserData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          dateOfBirth: new Date(user.dateOfBirth),
          gender: user.gender || '',
          image: user.image || '',
          role: user.role || ''
        });
      } catch (error) {
        toast.error('Failed to load user data');
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateUserData = async (data: PersonalInfoFormData) => {
    try {
      await profileAPI.updateBasicInfo({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: new Date(data.dateOfBirth.getTime() - data.dateOfBirth.getTimezoneOffset() * 60000).toISOString().split('T')[0], // Convert to YYYY-MM-DD format in UTC
        gender: data.gender
      });

      // Update local state
      setUserData(prev => ({ ...prev, ...data }));
      
      // Update auth context if needed
      if (user) {
        setUser({ ...user, firstName: data.firstName, lastName: data.lastName });
      }

      toast.success('Profile information updated');
    } catch (error) {
      toast.error('Failed to update profile information');
      console.error('Error updating profile information:', error);
      throw error;
    }
  };

  const handleImageUpdate = (imageUrl: string) => {
    // Update local state
    setUserData(prev => ({ ...prev, image: imageUrl }));
    
    // Update auth context if needed
    if (user) {
      setUser({ ...user, image: imageUrl });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>

      <TabsContent value="personal-info" className="space-y-6">
        <PersonalInfoForm 
          userData={userData} 
          onSubmit={handleUpdateUserData}
          onImageUpdate={handleImageUpdate}
        />
      </TabsContent>

      <TabsContent value="password" className="space-y-6">
        <PasswordForm />
      </TabsContent>
    </Tabs>
  );
};

export default AccountTab;