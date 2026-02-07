import { useState, useMemo, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PersonalInfoForm from '@/components/myaccount/account/PersonalInfoForm';
import PasswordForm from '@/components/myaccount/account/PasswordForm';

import profileAPI from '@/services/profile';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/use-user-profile';
import { UserData, PersonalInfoFormData } from '@/types/account';

const ProfilePage = () => {
  const [activeSubTab, setActiveSubTab] = useState("personal-info");
  const { user, setUser } = useAuth();
  const queryClient = useQueryClient();
  
  // Fetch user profile with React Query (cached automatically)
  const { data: profileUser, isLoading, error } = useUserProfile();

  // Transform profile data to UserData format using useMemo
  const userData = useMemo<UserData>(() => {
    if (!profileUser) {
      return {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: new Date(),
    gender: '',
    image: '',
    role: '',
    emailVerified: null,
    kycVerified: false
      };
    }

    return {
      firstName: profileUser.firstName || '',
      lastName: profileUser.lastName || '',
      email: profileUser.email || '',
      phoneNumber: profileUser.phoneNumber || '',
      dateOfBirth: profileUser.dateOfBirth ? new Date(profileUser.dateOfBirth) : new Date(),
      gender: profileUser.gender || '',
      image: profileUser.image || '',
      role: profileUser.role || '',
      emailVerified: profileUser.emailVerified || null,
      kycVerified: profileUser.kycVerified || false
    };
  }, [profileUser]);

  // Show error toast if fetch fails
  useEffect(() => {
    if (error) {
        toast.error('Failed to load user data');
      }
  }, [error]);

  const handleUpdateUserData = async (data: PersonalInfoFormData) => {
    try {
      await profileAPI.updateBasicInfo({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: new Date(data.dateOfBirth.getTime() - data.dateOfBirth.getTimezoneOffset() * 60000).toISOString().split('T')[0], // Convert to YYYY-MM-DD format in UTC
        gender: data.gender,
      });

      // Invalidate user profile cache to refresh data
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      
      // Update auth context immediately for better UX
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
    // Invalidate user profile cache to refresh data
    queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    
    // Update auth context immediately for better UX
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

export default ProfilePage;