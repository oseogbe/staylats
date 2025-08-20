import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from "react-hot-toast";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, Camera, Eye, EyeOff } from 'lucide-react';

const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function MyAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("account");
  const [activeSubTab, setActiveSubTab] = useState("personal-info");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  // Mock user data - in real app this would come from context/API
  const [userData, setUserData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+2348123456789',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    avatar: '',
    accountStatus: 'ACTIVE ACCOUNT'
  });

  const personalInfoForm = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender,
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onPersonalInfoSubmit = async (data: PersonalInfoFormData) => {
    setIsLoading(true);
    
    // Mock API call
    setTimeout(() => {
      console.log('Updating personal info:', data);
      setUserData({ ...userData, ...data });
      setIsLoading(false);
      toast.success('Personal information updated successfully');
    }, 1500);
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);
    
    // Mock API call
    setTimeout(() => {
      console.log('Updating password:', { currentPassword: data.currentPassword, newPassword: data.newPassword });
      setIsLoading(false);
      passwordForm.reset();
      toast.success('Password updated successfully');
    }, 1500);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Mock file upload
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserData({ ...userData, avatar: e.target?.result as string });
        setIsUploadDialogOpen(false);
        toast.success('Profile picture updated successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const mainTabs = [
    { value: "account", label: "Account", icon: User },
    { value: "identification", label: "Identification", icon: User },
    { value: "bank-account", label: "Bank Account", icon: User },
    { value: "communications", label: "Communications", icon: User },
    { value: "referrals", label: "Referrals", icon: User },
    { value: "rental-request", label: "Rental Request", icon: User },
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

          <TabsContent value="account" className="space-y-6">
            <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
              </TabsList>

              <TabsContent value="personal-info" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile Section */}
                  <Card className="lg:col-span-1">
                    <CardHeader className="text-center">
                      <CardTitle>Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src={userData.avatar} alt="Profile" />
                            <AvatarFallback className="bg-primary/10">
                              <User className="h-8 w-8 text-primary" />
                            </AvatarFallback>
                          </Avatar>
                          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                              >
                                <Camera className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Upload Profile Picture</DialogTitle>
                                <DialogDescription>
                                  Choose a file or drag and drop
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                                  <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                  <p className="text-sm text-muted-foreground mb-2">
                                    Choose a file or drag and drop
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    JPG, PNG, PDF Maximum file size 4 MB
                                  </p>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="avatar-upload"
                                  />
                                  <label htmlFor="avatar-upload">
                                    <Button className="mt-4" asChild>
                                      <span>Upload</span>
                                    </Button>
                                  </label>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-foreground">{userData.email}</p>
                          <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
                            {userData.accountStatus}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Update Information Form */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Update Information</CardTitle>
                      <CardDescription>
                        Update your personal information below
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...personalInfoForm}>
                        <form onSubmit={personalInfoForm.handleSubmit(onPersonalInfoSubmit)} className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={personalInfoForm.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your first name" {...field} disabled={isLoading} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={personalInfoForm.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Last Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your last name" {...field} disabled={isLoading} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={personalInfoForm.control}
                            name="phoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="+234" {...field} disabled={isLoading} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={personalInfoForm.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date of Birth</FormLabel>
                                <FormControl>
                                  <Input
                                    type="date"
                                    {...field}
                                    disabled={isLoading}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={personalInfoForm.control}
                            name="gender"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select Gender" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save'}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="password" className="space-y-6">
                <Card className="max-w-2xl">
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showCurrentPassword ? "text" : "password"}
                                    placeholder="Current password"
                                    {...field}
                                    disabled={isLoading}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                  >
                                    {showCurrentPassword ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="New password"
                                    {...field}
                                    disabled={isLoading}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                  >
                                    {showNewPassword ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm password"
                                    {...field}
                                    disabled={isLoading}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  >
                                    {showConfirmPassword ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? 'Updating Password...' : 'Update Password'}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Placeholder content for other tabs */}
          <TabsContent value="identification" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Identity Verification</CardTitle>
                <CardDescription>
                  We need to verify your identity to ensure a secure and trustworthy rental experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <User className="h-8 w-8 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">Individual</h3>
                    <p className="text-sm text-muted-foreground">
                      Verify your identity as an individual using government-issued ID
                    </p>
                  </Card>
                  <Card className="p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <User className="h-8 w-8 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">Company</h3>
                    <p className="text-sm text-muted-foreground">
                      Verify your business using CAC registration documents
                    </p>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bank-account" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="communications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Communications</CardTitle>
                <CardDescription>
                  Manage your communication preferences and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Communication settings coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="referrals" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="rental-request" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rental Request</CardTitle>
                <CardDescription>
                  View and manage your rental requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Rental requests coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}