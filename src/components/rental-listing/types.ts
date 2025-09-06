import { z } from 'zod';

export const propertyTypes = [
  'Apartment', 'House', 'Studio', 'Duplex', 'Mansion', 'Bungalow', 'Penthouse', 'Room'
] as const;

export const amenitiesList = [
  'WiFi', 'Air Conditioning', 'Kitchen', 'Washing Machine', 'TV', 'Parking',
  'Swimming Pool', 'Gym', 'Security', 'Generator', 'Garden', 'Balcony',
  'Furnished', 'Pet Friendly', 'Smoking Allowed'
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
  title: z.string().min(5, 'Title must be at least 5 characters').max(60, 'Title must be less than 60 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters').max(500, 'Description must be less than 500 characters'),
  address: z.string().min(10, 'Please provide a detailed address'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  bedrooms: z.number().min(1, 'At least 1 bedroom required'),
  bathrooms: z.number().min(1, 'At least 1 bathroom required'),
  maxGuests: z.number().min(1, 'At least 1 guest capacity required'),
  photos: z.array(z.string()).min(5, 'At least 5 photos are required'),
  amenities: z.array(z.string()).min(1, 'Select at least one amenity'),
  price: z.number().min(1000, 'Minimum price is ₦1,000'),
  contractTerm: z.string().min(1, 'Contract term is required'),
  securityDeposit: z.number().min(0, 'Security deposit must be positive'),
  agentFee: z.number().min(0, 'Agent fee must be positive')
});

export type RentalListingFormData = z.infer<typeof rentalListingSchema>;

export interface StepProps {
  form: any; // We'll replace this with the proper type from react-hook-form
  onNext?: () => void;
  onPrev?: () => void;
  isLastStep?: boolean;
}
