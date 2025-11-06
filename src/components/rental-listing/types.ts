import { z } from 'zod';

export const propertyTypes = [
  'Self-Contain', 'Apartment', 'Bungalow', 'Terrace Duplex', 'Semi-Detached Duplex', 'Fully-Detached Duplex', 
  'Penthouse', 'Mansion'
] as const;

export const states = [
  'Abuja', 'Lagos'
] as const;

export const amenitiesList = [
  'Living Room', 'Dining Area', 'Pantry', 'Kitchen', 'Guest Toilet', 'Walk-in Closet', 'Walk-in Showers', 
  'All Rooms En-Suite', 'TV', 'WiFi', 'CCTV', 'Air Conditioning', 'Washing Machine', 'Smart Home', 
  'Bluetooth Speakers', 'Generator', 'Garden', 'Balcony', 'Parking Area', 'Backyard', 'Frontyard', 'Green Space',
  'BBQ Area', 'Swimming Pool', 'Gym', 'Cinema', 'Supermarket', 'Spa', 'Security',
  '24/7 Electricity', 'Accessible Road', 'Constant Water Supply', 'Serene Environment'
] as const;

export const contractTerms = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly (3 months)' },
  { value: 'bi-annual', label: 'Bi-annual (6 months)' },
  { value: 'yearly', label: 'Yearly (12 months)' },
  { value: 'biennial', label: 'Biennial (24 months)' }
] as const;

export const rentalListingSchema = z.object({
  propertyType: z.string().min(1, 'Property type is required'),
  title: z.string().min(5, 'Title must be at least 5 characters').max(80, 'Title must be less than 80 characters'),
  description: z.string().refine((val) => !val || val === '' || val.length >= 200, {
    message: 'Description must be at least 200 characters'
  }).refine((val) => !val || val === '' || val.length <= 500, {
    message: 'Description must be less than 500 characters'
  }).optional(),
  address: z.string().min(10, 'Please enter a valid address'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  bedrooms: z.number().min(1, 'At least 1 bedroom required'),
  bathrooms: z.number().min(1, 'At least 1 bathroom required'),
  maxGuests: z.number().min(1, 'At least 1 guest capacity required'),
  photos: z.array(z.string()).min(5, 'At least 5 photos are required').max(15, 'Maximum 15 photos allowed'),
  photoFiles: z.array(z.instanceof(File)).optional(),
  amenities: z.array(z.string()).min(1, 'Select at least one amenity'),
  pricing: z.record(z.string(), z.number()).refine(
    (pricing) => {
      // Check that at least one pricing term exists
      if (Object.keys(pricing).length === 0) {
        return false;
      }
      // Check that all pricing values are at least 1000
      return Object.values(pricing).every(price => price >= 1000);
    },
    {
      message: 'Each rental price must be at least ₦1,000'
    }
  ).refine(
    (pricing) => Object.keys(pricing).length > 0,
    {
      message: 'At least one pricing term is required'
    }
  ),
  inspectionFee: z.number().min(0, 'Inspection fee must be positive').optional(),
  serviceCharge: z.number().min(0, 'Service charge must be positive').optional(),
  tenancyAgreement: z.string().url('Invalid tenancy agreement URL').optional(),
  tenancyAgreementFile: z.instanceof(File)
    .refine((file) => file.type === 'application/pdf', 'Only PDF is allowed')
    .optional(),
  requiredDocuments: z.array(z.string().min(1, 'Document name required')).min(1, 'Add at least one required document').optional(),
  contractTerms: z.array(z.string()).min(1, 'Select at least one contract term'),
  securityDeposit: z.number().min(0, 'Security deposit must be positive'),
  agentPercentage: z.number().min(0, 'Agent percentage must be positive')
});

export type RentalListingFormData = z.infer<typeof rentalListingSchema>;

export interface StepProps {
  form: any; // We'll replace this with the proper type from react-hook-form
  photoUploadHook?: any; // Photo upload hook for steps that need it
  onNext?: () => void;
  onPrev?: () => void;
  isLastStep?: boolean;
}
