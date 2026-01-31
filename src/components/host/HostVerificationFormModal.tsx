import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, FileText, X, Loader2, Building2, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import profileAPI from '@/services/profile';

// ID types for individual verification
const ID_TYPES = [
  { value: 'NIN', label: 'National Identification Number (NIN)' },
  { value: "Driver's License", label: "Driver's License" },
  { value: 'Passport', label: 'Passport' },
] as const;

// Form schema
const hostVerificationSchema = z.object({
  hostType: z.enum(['individual', 'agency'], {
    required_error: 'Please select whether you are an individual or agency',
  }),
  // Individual fields
  idType: z.string().optional(),
  idNumber: z.string().optional(),
  idDocFile: z.instanceof(File).optional(),
  // Agency fields
  companyName: z.string().optional(),
  registrationNumber: z.string().optional(),
  cacDocFile: z.instanceof(File).optional(),
}).refine((data) => {
  if (data.hostType === 'individual') {
    return data.idType && data.idNumber && data.idDocFile;
  } else {
    return data.companyName && data.registrationNumber && data.cacDocFile;
  }
}, {
  message: 'Please fill in all required fields for your selected type',
  path: ['hostType'],
});

type HostVerificationFormData = z.infer<typeof hostVerificationSchema>;

interface HostVerificationFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function HostVerificationFormModal({ open, onOpenChange, onSuccess }: HostVerificationFormModalProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idDocPreview, setIdDocPreview] = useState<string | null>(null);
  const [cacDocPreview, setCacDocPreview] = useState<string | null>(null);

  const form = useForm<HostVerificationFormData>({
    resolver: zodResolver(hostVerificationSchema),
    defaultValues: {
      hostType: undefined,
      idType: undefined,
      idNumber: undefined,
      idDocFile: undefined,
      companyName: undefined,
      registrationNumber: undefined,
      cacDocFile: undefined,
    },
  });

  const hostType = form.watch('hostType');

  const handleIdDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('idDocFile', file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setIdDocPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        setIdDocPreview('pdf');
      }
    }
  };

  const handleCacDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('cacDocFile', file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCacDocPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        setCacDocPreview('pdf');
      }
    }
  };

  const removeIdDoc = () => {
    form.setValue('idDocFile', undefined);
    setIdDocPreview(null);
  };

  const removeCacDoc = () => {
    form.setValue('cacDocFile', undefined);
    setCacDocPreview(null);
  };

  const onSubmit = async (data: HostVerificationFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      if (data.hostType === 'individual') {
        formData.append('hostType', 'landlord'); // Map to schema value
        formData.append('idType', data.idType!);
        formData.append('idNumber', data.idNumber!);
        if (data.idDocFile) {
          formData.append('idDocFile', data.idDocFile);
        }
      } else {
        formData.append('hostType', 'company');
        formData.append('companyName', data.companyName!);
        formData.append('registrationNumber', data.registrationNumber!);
        if (data.cacDocFile) {
          formData.append('cacDocFile', data.cacDocFile);
        }
      }

      await profileAPI.submitHostVerification(formData);

      // Invalidate user profile cache to refetch updated data
      await queryClient.invalidateQueries({ queryKey: ['userProfile'] });

      toast.success('Your host verification has been submitted successfully. We will review it shortly.');

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Reset form and close modal
      form.reset();
      setIdDocPreview(null);
      setCacDocPreview(null);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to submit verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      setIdDocPreview(null);
      setCacDocPreview(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Complete Host Verification</DialogTitle>
          <DialogDescription>
            Please provide the required information to verify your host profile. This helps ensure the safety and authenticity of all listings.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Host Type Selection */}
            <FormField
              control={form.control}
              name="hostType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>I am operating as:</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-3"
                    >
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="individual" id="individual" />
                        <Label htmlFor="individual" className="flex items-center gap-2 cursor-pointer flex-1">
                          <User className="h-5 w-5" />
                          <div>
                            <div className="font-medium">Individual (Solo Agent)</div>
                            <div className="text-sm text-muted-foreground">
                              I am operating as an individual landlord or facility manager
                            </div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="agency" id="agency" />
                        <Label htmlFor="agency" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Building2 className="h-5 w-5" />
                          <div>
                            <div className="font-medium">Agency</div>
                            <div className="text-sm text-muted-foreground">
                              I am operating as a company or agency
                            </div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Individual Fields */}
            {hostType === 'individual' && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <h3 className="font-semibold text-sm">Individual Verification Details</h3>
                
                <FormField
                  control={form.control}
                  name="idType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Government-Issued ID Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select ID type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ID_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="idNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your ID number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the number on your government-issued ID
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="idDocFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Document</FormLabel>
                      <FormDescription>
                        Upload a clear photo or scan of your government-issued ID (PDF or image, max 5MB)
                      </FormDescription>
                      <FormControl>
                        <div className="space-y-2">
                          {!idDocPreview ? (
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                              <label htmlFor="id-doc-upload" className="cursor-pointer">
                                <div className="flex flex-col items-center gap-2">
                                  <Upload className="h-8 w-8 text-muted-foreground" />
                                  <div className="text-sm font-medium">Upload ID Document</div>
                                  <div className="text-xs text-muted-foreground">
                                    PNG, JPG, JPEG, or PDF (max 5MB)
                                  </div>
                                </div>
                                <input
                                  id="id-doc-upload"
                                  type="file"
                                  accept="image/*,application/pdf"
                                  className="hidden"
                                  onChange={handleIdDocChange}
                                />
                              </label>
                            </div>
                          ) : (
                            <div className="relative border rounded-lg p-4">
                              <div className="flex items-center gap-3">
                                {idDocPreview === 'pdf' ? (
                                  <FileText className="h-10 w-10 text-muted-foreground" />
                                ) : (
                                  <img
                                    src={idDocPreview}
                                    alt="ID document preview"
                                    className="h-20 w-20 object-cover rounded"
                                  />
                                )}
                                <div className="flex-1">
                                  <div className="text-sm font-medium">
                                    {idDocPreview === 'pdf' ? 'PDF Document' : 'Image Document'}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {form.getValues('idDocFile')?.name || 'Document uploaded'}
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={removeIdDoc}
                                  className="h-8 w-8"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Agency Fields */}
            {hostType === 'agency' && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <h3 className="font-semibold text-sm">Company Verification Details</h3>
                
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="registrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CAC Registration Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter CAC registration number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter your Corporate Affairs Commission (CAC) registration number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cacDocFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CAC Document</FormLabel>
                      <FormDescription>
                        Upload your CAC registration document (PDF or image, max 5MB)
                      </FormDescription>
                      <FormControl>
                        <div className="space-y-2">
                          {!cacDocPreview ? (
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                              <label htmlFor="cac-doc-upload" className="cursor-pointer">
                                <div className="flex flex-col items-center gap-2">
                                  <Upload className="h-8 w-8 text-muted-foreground" />
                                  <div className="text-sm font-medium">Upload CAC Document</div>
                                  <div className="text-xs text-muted-foreground">
                                    PNG, JPG, JPEG, or PDF (max 5MB)
                                  </div>
                                </div>
                                <input
                                  id="cac-doc-upload"
                                  type="file"
                                  accept="image/*,application/pdf"
                                  className="hidden"
                                  onChange={handleCacDocChange}
                                />
                              </label>
                            </div>
                          ) : (
                            <div className="relative border rounded-lg p-4">
                              <div className="flex items-center gap-3">
                                {cacDocPreview === 'pdf' ? (
                                  <FileText className="h-10 w-10 text-muted-foreground" />
                                ) : (
                                  <img
                                    src={cacDocPreview}
                                    alt="CAC document preview"
                                    className="h-20 w-20 object-cover rounded"
                                  />
                                )}
                                <div className="flex-1">
                                  <div className="text-sm font-medium">
                                    {cacDocPreview === 'pdf' ? 'PDF Document' : 'Image Document'}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {form.getValues('cacDocFile')?.name || 'Document uploaded'}
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={removeCacDoc}
                                  className="h-8 w-8"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Verification'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

