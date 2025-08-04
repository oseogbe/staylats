import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone } from 'lucide-react';

const phoneSchema = z.object({
  phoneNumber: z.string().min(11, 'Phone number must be at least 11 digits').regex(/^\d+$/, 'Phone number must contain only digits'),
});

type PhoneFormData = z.infer<typeof phoneSchema>;

export default function PhoneRegistration() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });

  const onSubmit = async (data: PhoneFormData) => {
    setIsLoading(true);
    
    // Mock API call
    setTimeout(() => {
      console.log('Sending OTP to:', data.phoneNumber);
      setIsLoading(false);
      // Navigate to OTP verification with phone number
      navigate('/host/verify-otp', { state: { phoneNumber: data.phoneNumber } });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Join as a Host</CardTitle>
          <CardDescription>
            Enter your phone number to get started with hosting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="08012345678"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      We'll send you a verification code
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending OTP...' : 'Send Verification Code'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}