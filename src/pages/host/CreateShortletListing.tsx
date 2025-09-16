import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, BedDouble } from 'lucide-react';
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
  shortletListingSchema,
  type ShortletListingFormData
} from '@/components/shortlet-listing';

const steps = [
  { id: 1, title: 'Property Basics', description: 'Tell us about your property', Component: PropertyBasics },
  { id: 2, title: 'Location & Capacity', description: 'Where is it and how many guests?', Component: Location },
  { id: 3, title: 'Photos & Description', description: 'Show off your space', Component: Photos },
  { id: 4, title: 'Amenities & Features', description: 'What makes it special?', Component: Amenities },
  { id: 5, title: 'Pricing & Availability', description: 'Set your rates and availability', Component: Pricing },
  { id: 6, title: 'Review & Publish', description: 'Final review before going live', Component: Review }
];

export default function CreateShortletListing() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const form = useForm<ShortletListingFormData>({
    resolver: zodResolver(shortletListingSchema),
    mode: 'onChange', // Trigger validation on change
    defaultValues: {
      propertyType: '',
      title: '',
      description: '',
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      address: '',
      city: '',
      state: '',
      photos: [],
      amenities: [],
      pricePerNight: 15000,
      cleaningFee: 5000,
      securityDeposit: 20000,
      minimumStay: 1,
      maximumStay: 30,
      checkInTime: '15:00',
      checkOutTime: '11:00'
    }
  });

  // Watch form values to make validation reactive
  const watchedValues = form.watch();
  
  // Check if current step has validation errors or missing required fields
  const getCurrentStepErrors = () => {
    const stepFields: Record<number, (keyof ShortletListingFormData)[]> = {
      1: ['propertyType', 'bedrooms', 'bathrooms', 'maxGuests'],
      2: ['address', 'city', 'state'],
      3: ['title', 'description', 'photos'],
      4: ['amenities'],
      5: ['pricePerNight', 'cleaningFee', 'securityDeposit', 'minimumStay', 'maximumStay', 'checkInTime', 'checkOutTime'],
      6: [] // Review step - no validation needed
    };

    const fieldsToCheck = stepFields[currentStep];
    if (!fieldsToCheck) return false;

    // Check if any of the current step fields have errors
    const hasErrors = fieldsToCheck.some(field => {
      const fieldState = form.getFieldState(field);
      return fieldState.error !== undefined;
    });

    // Check for missing required fields based on current step
    const hasMissingFields = (() => {
      switch (currentStep) {
        case 1:
          return !watchedValues.propertyType || watchedValues.propertyType === '';
        case 2:
          return !watchedValues.address || watchedValues.address === '' || 
                 !watchedValues.city || watchedValues.city === '' || 
                 !watchedValues.state || watchedValues.state === '';
        case 3:
          return !watchedValues.photos || watchedValues.photos.length < 5;
        case 4:
          return !watchedValues.amenities || watchedValues.amenities.length === 0;
        case 5:
          return !watchedValues.pricePerNight || watchedValues.pricePerNight < 5000;
        case 6:
          return false; // Review step - no validation needed
        default:
          return false;
      }
    })();

    return hasErrors || hasMissingFields;
  };

  const hasCurrentStepErrors = getCurrentStepErrors();

  const nextStep = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    
    if (currentStep < steps.length) {
      // Define the fields to validate for each step
      const stepFields: Record<number, (keyof ShortletListingFormData)[]> = {
        1: ['propertyType', 'bedrooms', 'bathrooms', 'maxGuests'],
        2: ['address', 'city', 'state'],
        3: ['title', 'description', 'photos'],
        4: ['amenities'],
        5: ['pricePerNight', 'cleaningFee', 'securityDeposit', 'minimumStay', 'maximumStay', 'checkInTime', 'checkOutTime'],
        6: [] // Review step - no validation needed
      };

      const fieldsToValidate = stepFields[currentStep];
      
      if (fieldsToValidate && fieldsToValidate.length > 0) {
        // Trigger validation for the current step fields
        const isValid = await form.trigger(fieldsToValidate);
        
        if (!isValid) {
          // Validation failed, don't proceed to next step
          return;
        }
      }
      
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = (e?: React.MouseEvent) => {
    e?.preventDefault();
    
    if (currentStep > 1) {
      // Clear validation errors when going back
      form.clearErrors();
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: ShortletListingFormData) => {
    console.log('Shortlet listing data:', data);
    toast.success("Your shortlet listing has successfully submitted for review.");
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
              <h1 className="text-2xl font-bold">Create Shortlet Listing</h1>
              <p className="text-muted-foreground">Step {currentStep} of {steps.length}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <BedDouble className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Shortlet Property</span>
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
                      disabled={hasCurrentStepErrors}
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
