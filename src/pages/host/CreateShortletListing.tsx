import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  PropertyBasics,
  Location,
  Photos,
  Amenities,
  Pricing,
  PropertyVerification,
  Review,
  shortletListingSchema,
  type ShortletListingFormData
} from '@/components/shortlet-listing';
import { LoadingOverlay } from '@/components/LoadingOverlay';

import listingsService from '@/services/listings';
import { usePhotoUpload } from '@/components/shortlet-listing/use-photo-upload';

import { ArrowLeft, ArrowRight, CheckCircle, BedDouble } from 'lucide-react';

const steps = [
  { id: 1, title: 'Property Basics', description: 'Tell us about your property', Component: PropertyBasics },
  { id: 2, title: 'Location & Capacity', description: 'Where is it and how many guests?', Component: Location },
  { id: 3, title: 'Photos & Description', description: 'Show off your space', Component: Photos },
  { id: 4, title: 'Amenities & Features', description: 'What makes it special?', Component: Amenities },
  { id: 5, title: 'Pricing & Availability', description: 'Set your rates and availability', Component: Pricing },
  { id: 6, title: 'Verification', description: 'Verify property authenticity', Component: PropertyVerification },
  { id: 7, title: 'Review & Publish', description: 'Final review before going live', Component: Review }
];

export default function CreateShortletListing() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const [draftId, setDraftId] = useState<string | undefined>(undefined);
  const [confirmBackOpen, setConfirmBackOpen] = useState(false);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const form = useForm<ShortletListingFormData>({
    resolver: zodResolver(shortletListingSchema),
    mode: 'onChange', // Trigger validation on change
    defaultValues: {
      propertyType: '',
      title: '',
      description: '',
      houseRules: '',
      bedrooms: 1,
      bathrooms: 1,
      maxAdults: 2,
      maxKids: 0,
      maxInfants: 0,
      allowPets: true,
      address: '',
      city: '',
      state: '',
      latitude: undefined,
      longitude: undefined,
      photos: [],
      photoFiles: [],
      amenities: [],
      pricePerNight: 30000,
      cleaningFee: 0,
      securityDeposit: 0,
      minimumStay: 1,
      maximumStay: 30,
      checkInTime: '15:00',
      checkOutTime: '11:00',
      proofOfVisit: undefined,
      proofOfVisitFile: undefined,
      utilityBill: undefined,
      utilityBillFile: undefined
    }
  });

  // Watch form values to make validation reactive
  const watchedValues = form.watch();

  // Get the photo upload hook for loading existing photos
  const photoUploadHook = usePhotoUpload(
    form.setValue
  );

  // Load draft data if draftId is provided
  useEffect(() => {
    const loadDraft = async () => {
      const stateDraftId = location.state?.draftId;
      if (stateDraftId) {
        setIsLoadingDraft(true);
        try {
          const draftData = await listingsService.getDraftById(stateDraftId);
          const draft = draftData.draft;

          if (draft) {
            setDraftId(draft.id);

            // Set the current step based on draft data
            if (draft.step) {
              setCurrentStep(draft.step);
            }

            // Pre-fill form with draft data
            if (draft.formData) {
              const formData = draft.formData as any;

              // Reset form with draft data (excluding photos for now)
              form.reset({
                propertyType: formData.propertyType || '',
                title: formData.title || '',
                description: formData.description || '',
                houseRules: formData.houseRules || '',
                address: formData.address || '',
                city: formData.city || '',
                state: formData.state || '',
                latitude: formData.latitude || undefined,
                longitude: formData.longitude || undefined,
                bedrooms: formData.bedrooms || 1,
                bathrooms: formData.bathrooms || 1,
                maxAdults: formData.maxAdults || 2,
                maxKids: formData.maxKids || 0,
                maxInfants: formData.maxInfants || 0,
                allowPets: formData.allowPets || true,
                photos: draft.images || [],
                photoFiles: [], // Will be empty for loaded drafts
                amenities: formData.amenities || [],
                pricePerNight: formData.pricePerNight || 15000,
                cleaningFee: formData.cleaningFee || 5000,
                securityDeposit: formData.securityDeposit || 20000,
                minimumStay: formData.minimumStay || 1,
                maximumStay: formData.maximumStay || 30,
                checkInTime: formData.checkInTime || '15:00',
                checkOutTime: formData.checkOutTime || '11:00',
                availableFrom: formData.availableFrom ? new Date(formData.availableFrom) : undefined,
                availableUntil: formData.availableUntil ? new Date(formData.availableUntil) : undefined
              });

              // Load existing photos into the photo upload hook
              if (draft.images && draft.images.length > 0) {
                photoUploadHook.loadExistingPhotos(draft.images);
              }
            }
          }
        } catch (error) {
          console.error('Failed to load draft:', error);
          toast.error('Failed to load listing draft');
        } finally {
          setIsLoadingDraft(false);
        }
      }
    };

    loadDraft();
  }, [location.state?.draftId, form]);

  // Check if current step has validation errors or missing required fields
  const getCurrentStepErrors = () => {
    const stepFields: Record<number, (keyof ShortletListingFormData)[]> = {
      1: ['propertyType', 'bedrooms', 'bathrooms', 'maxAdults', 'maxKids', 'maxInfants', 'allowPets'],
      2: ['address', 'city', 'state'],
      3: ['title', 'description', 'houseRules', 'photos'],
      4: ['amenities'],
      5: ['pricePerNight', 'cleaningFee', 'securityDeposit', 'minimumStay', 'maximumStay', 'checkInTime', 'checkOutTime'],
      6: ['proofOfVisitFile'], // Verification step
      7: [] // Review step - no validation needed
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
          return !watchedValues.proofOfVisitFile; // Verification step - proof of visit is required
        case 7:
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
        1: ['propertyType', 'bedrooms', 'bathrooms', 'maxAdults', 'maxKids', 'maxInfants', 'allowPets'],
        2: ['address', 'city', 'state'],
        3: ['title', 'description', 'houseRules', 'photos'],
        4: ['amenities'],
        5: ['pricePerNight', 'cleaningFee', 'securityDeposit', 'minimumStay', 'maximumStay', 'checkInTime', 'checkOutTime'],
        6: ['proofOfVisitFile'], // Verification step
        7: [] // Review step - no validation needed
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

  const [isPublishing, setIsPublishing] = useState(false);

  const onSubmit = async (data: ShortletListingFormData) => {
    try {
      setIsPublishing(true);

      // Remove photos and photoFiles from formData since they're handled separately
      const { photos, photoFiles, proofOfVisitFile, utilityBillFile, ...cleanFormData } = data;

      await listingsService.publishListing({
        draftId: draftId, // Will be undefined for new listings
        formData: {
          ...cleanFormData,
          type: 'shortlet'
        },
        photoItems: photoUploadHook.photos,
        photoFiles: photoUploadHook.uploadedFiles,
        proofOfVisitFile: data.proofOfVisitFile,
        utilityBillFile: data.utilityBillFile
      });

      toast.success("Your shortlet listing has successfully submitted for review.");
      navigate('/host/property-management');
    } catch (error) {
      console.error('Failed to publish listing:', error);
      toast.error('Failed to publish listing. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].Component;

  if (isLoadingDraft) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading draft...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 relative">
      <LoadingOverlay 
        isLoading={isPublishing || isSavingDraft}
        message={isPublishing ? 'Publishing your listing...' : 'Saving draft...'}
      />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            {currentStep <= 2 ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/host/create-listing')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            ) : (
              <AlertDialog open={confirmBackOpen} onOpenChange={setConfirmBackOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmBackOpen(true)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Save this listing as a draft?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You have unsaved progress. Choose whether to save your current form data as a draft before leaving.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel 
                      disabled={isSavingDraft}
                      onClick={() => setConfirmBackOpen(false)}
                    >
                      Stay
                    </AlertDialogCancel>
                    <Button
                      variant="secondary"
                      disabled={isSavingDraft}
                      onClick={() => {
                        // Leave without saving
                        setConfirmBackOpen(false);
                        navigate('/host/property-management');
                      }}
                    >
                      Leave without saving
                    </Button>
                    <AlertDialogAction
                      disabled={isSavingDraft}
                      onClick={async () => {
                        try {
                          setIsSavingDraft(true);
                          const formData = form.getValues();

                          // Remove photos and photoFiles from formData since they're handled separately
                          const { photos, photoFiles, proofOfVisitFile, utilityBillFile, ...cleanFormData } = formData;

                          if (draftId) {
                            // Update existing draft - send PhotoItems array and File objects
                            await listingsService.updateDraft(draftId, {
                              type: 'shortlet',
                              title: formData.title,
                              step: currentStep,
                              totalSteps: steps.length,
                              formData: cleanFormData,
                              photoItems: photoUploadHook.photos,
                              photoFiles: photoUploadHook.uploadedFiles,
                              proofOfVisitFile,
                              utilityBillFile
                            });
                          } else {
                            // Create new draft
                            const response = await listingsService.saveDraft({
                              type: 'shortlet',
                              title: formData.title,
                              step: currentStep,
                              totalSteps: steps.length,
                              formData: cleanFormData,
                              images: formData.photoFiles || [],
                              proofOfVisitFile,
                              utilityBillFile
                            });
                            if (response?.data?.draftId) {
                              setDraftId(response.data.draftId);
                            }
                          }
                          toast.success('Draft saved');
                          setConfirmBackOpen(false);
                          navigate('/host/property-management');
                        } catch (error) {
                          toast.error('Failed to save draft');
                          setIsSavingDraft(false);
                        }
                      }}
                    >
                      Save draft and leave
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
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
          <div className="flex items-center justify-between gap-1 md:gap-2">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-medium ${currentStep >= step.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                  {step.id}
                </div>
                <div className="hidden md:block text-xs text-center mt-2 max-w-20">
                  <div className="font-medium">{step.title}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 md:mt-4 bg-muted rounded-full h-2">
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
                  photoUploadHook={photoUploadHook}
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
                    <Button 
                      type="submit" 
                      disabled={isPublishing}
                    >
                      {isPublishing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Publish Listing
                        </>
                      )}
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
