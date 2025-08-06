import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";

const userRegistrationSchema = z.object({
  firstName: z.string().min(1, "First name is required").min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(1, "Last name is required").min(2, "Last name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  dateOfBirth: z.string().min(1, "Date of birth is required")
});

type UserRegistrationFormData = z.infer<typeof userRegistrationSchema>;

interface UserRegistrationStepProps {
  phoneNumber: string;
  onRegistrationComplete: (userData: UserRegistrationFormData & { phoneNumber: string }) => void;
  onBack: () => void;
}

const UserRegistrationStep = ({ phoneNumber, onRegistrationComplete, onBack }: UserRegistrationStepProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UserRegistrationFormData>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: ""
    }
  });

  const onSubmit = async (data: UserRegistrationFormData) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API delay
      onRegistrationComplete({ ...data, phoneNumber });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <button
          onClick={onBack}
          className="absolute left-0 top-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <DialogTitle className="text-xl font-semibold text-center">
          Finish signing up
        </DialogTitle>
        <DialogDescription className="text-center">
          Tell us a bit about yourself to complete your account
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
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
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
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
                  <FormLabel>Date of birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-xs text-muted-foreground space-y-2">
              <p>
                By selecting <strong>Agree and continue</strong>, I agree to Staylats's{" "}
                <button type="button" className="underline">
                  Terms of Service
                </button>
                ,{" "}
                <button type="button" className="underline">
                  Payments Terms of Service
                </button>
                , and{" "}
                <button type="button" className="underline">
                  Nondiscrimination Policy
                </button>{" "}
                and acknowledge the{" "}
                <button type="button" className="underline">
                  Privacy Policy
                </button>
                .
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Agree and continue"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default UserRegistrationStep;