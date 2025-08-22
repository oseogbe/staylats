import { useForm, UseFormSetError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MonthYearCalendar } from "@/components/MonthYearCalendar";

import { ArrowLeft } from "lucide-react";

const userRegistrationSchema = z.object({
  firstName: z.string().min(2, ""),
  lastName: z.string().min(2, ""),
  email: z.string().min(6, "").email("Please enter a valid email address"),
  dateOfBirth: z.date({
    required_error: "",
  }).refine((date) => {
    const now = new Date();
    const age = now.getFullYear() - date.getFullYear();
    return age >= 18;
  }, "Must be at least 18 years old"),
  gender: z.enum(["male", "female"], {
    required_error: ""
  })
});

type UserRegistrationFormData = z.infer<typeof userRegistrationSchema>;

interface UserRegistrationStepProps {
  onRegistrationComplete: (
    userData: UserRegistrationFormData,
    setFieldError: UseFormSetError<UserRegistrationFormData>
  ) => void;
  onBack: () => void;
  isLoading: boolean;
}

const UserRegistrationStep = ({ onRegistrationComplete, onBack, isLoading }: UserRegistrationStepProps) => {

  const form = useForm<UserRegistrationFormData>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: undefined,
      gender: undefined
    }
  });

  const onSubmit = async (data: UserRegistrationFormData) => {
    onRegistrationComplete(data, form.setError);
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
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of birth</FormLabel>
                  <FormControl>
                    <MonthYearCalendar
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pick a date"
                      maxDate={new Date()}
                    />
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