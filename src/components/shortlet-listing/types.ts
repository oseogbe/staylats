import { z } from 'zod';

export const propertyTypes = [
  'Room', 'Studio Apartment', 'Shared Apartment', 'Bungalow', 'Duplex', 'Semi-Detached Duplex', 'Terraced Duplex', 'Penthouse'
] as const;

export const states = [
  'Abuja', 'Lagos'
] as const;

export const amenitiesList = [
  'WiFi', 'Air Conditioning', 'Water Heater', 'Kitchen', 'Washing Machine', 'TV', 'Parking Area',
  'Swimming Pool', 'Hot Tub', 'Gym', 'Security', 'CCTV', 'Smart Home', 'Generator', 'Garden',
  'Balcony', 'Terrace', 'Beach Access', 'City View', 'Mountain View', 'Serene Environment',
  'Fireplace', 'BBQ Area', 'Game Room', 'Bluetooth Speakers', 'PS5', 'Pool Table', 'Netflix', 
  'Self Check-in', 'Concierge', 'Self Check-out', 'Free Breakfast', '24/7 Electricity', 'Cleaning Service', 
  'Laundry Service', 'Housekeeping', 'BQ', 'Pet Friendly', 'Smoking Allowed', 'Accessible Road'
] as const;

export const timeOptions = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', 
  '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
] as const;

export const shortletListingSchema = z.object({
  propertyType: z.string().min(1, 'Property type is required'),
  title: z.string().min(5, 'Title must be at least 5 characters').max(80, 'Title must be less than 80 characters'),
  description: z.string().refine((val) => !val || val === '' || val.length >= 200, {
    message: 'Description must be at least 200 characters'
  }).refine((val) => !val || val === '' || val.length <= 500, {
    message: 'Description must be less than 500 characters'
  }).optional(),
  houseRules: z.string().optional(),
  address: z.string().min(10, 'Please enter a valid address'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  bedrooms: z.number().min(1, 'At least 1 bedroom required'),
  bathrooms: z.number().min(1, 'At least 1 bathroom required'),
  maxAdults: z.number().min(1, 'At least 1 adult required'),
  maxKids: z.number().min(0, 'Kids must be 0 or more'),
  maxInfants: z.number().min(0, 'Infants must be 0 or more'),
  allowPets: z.boolean(),
  photos: z.array(z.string()).min(5, 'At least 5 photos are required').max(15, 'Maximum 15 photos allowed'),
  photoFiles: z.array(z.instanceof(File)).optional(),
  amenities: z.array(z.string()).min(1, 'Select at least one amenity'),
  pricePerNight: z.number().min(5000, 'Minimum price is ₦5,000 per night'),
  cleaningFee: z.number().min(0, 'Cleaning fee must be positive'),
  securityDeposit: z.number().min(0, 'Security deposit must be positive'),
  minimumStay: z.number().min(1, 'Minimum 1 night stay required'),
  maximumStay: z.number().min(1, 'Maximum stay must be at least 1 night'),
  checkInTime: z.string().min(1, 'Check-in time is required'),
  checkOutTime: z.string().min(1, 'Check-out time is required'),
  availableFrom: z.date().optional(),
  availableUntil: z.date().optional()
});

export type ShortletListingFormData = z.infer<typeof shortletListingSchema>;

export interface StepProps {
  form: any; // We'll replace this with the proper type from react-hook-form
  photoUploadHook?: any; // Photo upload hook instance
  onNext?: () => void;
  onPrev?: () => void;
  isLastStep?: boolean;
}
