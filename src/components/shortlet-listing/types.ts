import { z } from 'zod';

export const propertyTypes = [
  'Studio Apartment', 'Shared Apartment', 'Bungalow', 'Duplex', 'Semi-Detached Duplex', 'Penthouse', 'Room'
] as const;

export const states = [
  'Abuja', 'Lagos'
] as const;

export const amenitiesList = [
  'WiFi', 'Air Conditioning', 'Kitchen', 'Washing Machine', 'TV', 'Parking Area',
  'Swimming Pool', 'Hot Tub', 'Gym', 'Security', 'CCTV', 'Generator', 'Garden',
  'Balcony', 'Terrace', 'Beach Access', 'City View', 'Mountain View', 'Serene Environment',
  'Fireplace', 'BBQ Area', 'Game Room', 'PS5', 'Pool Table', 'Netflix', 'Self Check-in', 
  'Concierge', 'Self Check-out', 'Free Breakfast', '24/7 Electricity', 'Cleaning Service', 
  'Laundry Service', 'Housekeeping', 'BQ', 'Pet Friendly', 'Smoking Allowed', 'Accessible Road'
] as const;

export const timeOptions = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', 
  '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
] as const;

export const shortletListingSchema = z.object({
  propertyType: z.string().min(1, 'Property type is required'),
  title: z.string().min(5, 'Title must be at least 5 characters').max(60, 'Title must be less than 60 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters').max(500, 'Description must be less than 500 characters'),
  address: z.string().min(10, 'Please enter a valid address'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  bedrooms: z.number().min(1, 'At least 1 bedroom required'),
  bathrooms: z.number().min(1, 'At least 1 bathroom required'),
  maxGuests: z.number().min(1, 'At least 1 guest capacity required'),
  photos: z.array(z.string()).min(5, 'At least 5 photos are required'),
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
