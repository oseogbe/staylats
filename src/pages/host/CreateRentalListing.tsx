import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Home } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';

import {
  PropertyBasics,
  Location,
  Photos,
  Amenities,
  Pricing,
  Review,
  rentalListingSchema,
  type RentalListingFormData
} from '@/components/rental-listing';

const steps = [
  { id: 1, title: 'Property Basics', description: 'Tell us about your property', Component: PropertyBasics },
  { id: 2, title: 'Location & Capacity', description: 'Where is it and how many guests?', Component: Location },
  { id: 3, title: 'Photos & Description', description: 'Show off your space', Component: Photos },
  { id: 4, title: 'Amenities & Features', description: 'What makes it special?', Component: Amenities },
  { id: 5, title: 'Pricing & Terms', description: 'Set your rental terms', Component: Pricing },
  { id: 6, title: 'Review & Publish', description: 'Final review before going live', Component: Review }
];

export default function CreateRentalListing() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const form = useForm<RentalListingFormData>({
    resolver: zodResolver(rentalListingSchema),
    defaultValues: {
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      photos: [],
      amenities: [],
      price: 50000,
      securityDeposit: 100000,
      agentFee: 10
    }
  });

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: RentalListingFormData) => {
    console.log('Rental listing data:', data);
    toast.success("Your rental listing is now live and available for tenants to view.");
    navigate('/');
  };

  const CurrentStepComponent = steps[currentStep - 1].Component;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/host/create-listing')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Create Rental Listing</h1>
              <p className="text-muted-foreground">Step {currentStep} of {steps.length}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Home className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Rental Property</span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {step.id}
                </div>
                <div className="text-xs text-center mt-2 max-w-20">
                  <div className="font-medium">{step.title}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <CurrentStepComponent
                  form={form}
                  onNext={nextStep}
                  onPrev={prevStep}
                  isLastStep={currentStep === steps.length}
                />

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep === steps.length ? (
                    <Button type="submit">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Publish Listing
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={
                        (currentStep === 3 && form.getValues('photos')?.length < 5) ||
                        (currentStep === 4 && form.getValues('amenities')?.length === 0)
                      }
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}