import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MonthYearCalendar } from '@/components/MonthYearCalendar';

import profileService from '@/services/profile';
import { capitalize } from '@/lib/utils';
import {
  personalInfoSchema,
  PersonalInfoFormData,
  UserData,
} from '@/types/account';

import { User, Camera, Trash2 } from 'lucide-react';

interface PersonalInfoFormProps {
  userData: UserData;
  onSubmit: (data: PersonalInfoFormData) => Promise<void>;
  onImageUpdate: (imageUrl: string) => void;
}

export default function PersonalInfoForm({
  userData,
  onSubmit,
  onImageUpdate,
}: PersonalInfoFormProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender,
    },
  });

  // Update form when userData changes
  useEffect(() => {
    form.reset({
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender,
    });
  }, [userData, form]);

  const handleSubmit = async (data: PersonalInfoFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } catch (error) {
      // Error is handled by parent component
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const { data } = await profileService.changeProfilePicture(formData);

      toast.success('Profile picture updated');
      setIsUploadDialogOpen(false);
      
      // Update the profile image in the UI through parent component
      onImageUpdate(data.image);
      
      // Clear the selected image and preview
      setSelectedImage(null);
      setPreviewUrl(null);
    } catch (error) {
      toast.error('Failed to upload profile picture');
      console.error('Error uploading profile picture:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
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
                <AvatarImage src={userData.image} alt="Profile" />
                <AvatarFallback className="bg-primary/10">
                  <User className="h-8 w-8 text-primary" />
                </AvatarFallback>
              </Avatar>
              <Dialog
                open={isUploadDialogOpen}
                onOpenChange={setIsUploadDialogOpen}
              >
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
                    {previewUrl ? (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={handleImageDelete}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
                          <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Choose a file or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            JPG, PNG (Maximum 2 MB)
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="image-upload"
                          />
                        </div>
                      </label>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsUploadDialogOpen(false)}
                      disabled={isUploading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleImageUpload}
                      disabled={!selectedImage || isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">{userData.email}</p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  {userData.role === 'visitor'
                    ? 'Basic'
                    : capitalize(userData.role)}
                </Badge>
                <Badge
                  variant="secondary"
                  className={`
                    ${userData.emailVerified !== null ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                    ${userData.emailVerified === null ? "cursor-pointer hover:bg-yellow-200 transition-colors" : ""}
                  `}
                  onClick={() => {
                    if (userData.emailVerified === null) {
                      navigate('/resend-verification', { state: { from: '/my-account' } });
                    }
                  }}
                >
                  {userData.emailVerified !== null ? "Email Verified" : "Email Unverified"}
                </Badge>
                <Badge
                  variant="secondary"
                  className={userData.kycVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                >
                  {userData.kycVerified ? "KYC Verified" : "KYC Unverified"}
                </Badge>
              </div>
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
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your first name"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your last name"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+234"
                        {...field}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <MonthYearCalendar
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(date) => field.onChange(date)}
                        placeholder="Select date of birth"
                        maxDate={new Date()}
                        minDate={new Date('1900-01-01')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
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
  );
}
