import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeft, ArrowRight, Upload, X, MapPin, Users, Bed, Bath, Building2, CheckCircle, CalendarIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, title: 'Property Basics', description: 'Tell us about your property' },
  { id: 2, title: 'Location & Capacity', description: 'Where is it and how many guests?' },
  { id: 3, title: 'Photos & Description', description: 'Show off your space' },
  { id: 4, title: 'Amenities & Features', description: 'What makes it special?' },
  { id: 5, title: 'Pricing & Availability', description: 'Set your rates and availability' },
  { id: 6, title: 'Review & Publish', description: 'Final review before going live' }
];

const propertyTypes = [
  'Apartment', 'House', 'Studio', 'Duplex', 'Villa', 'Cottage', 'Penthouse', 'Loft', 'Cabin'
];

const amenitiesList = [
  'WiFi', 'Air Conditioning', 'Kitchen', 'Washing Machine', 'TV', 'Parking',
  'Swimming Pool', 'Hot Tub', 'Gym', 'Security', 'Generator', 'Garden',
  'Balcony', 'Terrace', 'Beach Access', 'City View', 'Ocean View', 'Mountain View',
  'Fireplace', 'BBQ Area', 'Game Room', 'Netflix', 'Self Check-in', 'Concierge'
];

const formSchema = z.object({
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

type FormData = z.infer<typeof formSchema>;

const timeOptions = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', 
  '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
];

export default function CreateShortletListing() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
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

  const handlePhotoUpload = () => {
    // Mock photo upload
    const mockPhotoUrl = `https://picsum.photos/800/600?random=${uploadedPhotos.length + 100}`;
    const newPhotos = [...uploadedPhotos, mockPhotoUrl];
    setUploadedPhotos(newPhotos);
    form.setValue('photos', newPhotos);
  };

  const removePhoto = (index: number) => {
    const newPhotos = uploadedPhotos.filter((_, i) => i !== index);
    setUploadedPhotos(newPhotos);
    form.setValue('photos', newPhotos);
  };

  const onSubmit = (data: FormData) => {
    console.log('Shortlet listing data:', data);
    toast({
      title: "Listing Created Successfully!",
      description: "Your shortlet listing is now live and available for bookings.",
    });
    navigate('/');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Bed className="h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Bath className="h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxGuests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Guests</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Address</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <Input placeholder="e.g., 123 Victoria Island, Lagos" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>Provide the full address of your property</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lagos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lagos State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Luxury Oceanview Apartment in Victoria Island"
                      maxLength={60}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/60 characters. Keep it concise for property cards.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your property, its features, nearby attractions, and what makes it special for guests..."
                      maxLength={500}
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/500 characters. Highlight unique features and guest benefits.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Property Photos</FormLabel>
              <FormDescription className="mb-4">Upload at least 5 photos of your property</FormDescription>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {uploadedPhotos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Property photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handlePhotoUpload}
                className="w-full"
                disabled={uploadedPhotos.length >= 15}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo ({uploadedPhotos.length}/15)
              </Button>

              {uploadedPhotos.length < 5 && (
                <p className="text-sm text-red-500 mt-2">You need at least 5 photos to continue</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="amenities"
              render={() => (
                <FormItem>
                  <FormLabel>Property Amenities</FormLabel>
                  <FormDescription>Select all amenities available in your property</FormDescription>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                    {amenitiesList.map((amenity) => (
                      <FormField
                        key={amenity}
                        control={form.control}
                        name="amenities"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(amenity)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, amenity])
                                    : field.onChange(field.value?.filter((value) => value !== amenity))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">{amenity}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="pricePerNight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Night (₦)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="5000"
                        step="1000"
                        placeholder="15000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>Your nightly rate</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cleaningFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cleaning Fee (₦)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="1000"
                        placeholder="5000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>One-time cleaning fee</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="securityDeposit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Security Deposit (₦)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="1000"
                        placeholder="20000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>Refundable security deposit</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="minimumStay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Stay (nights)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="30"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maximumStay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Stay (nights)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="365"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="checkInTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check-in Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="checkOutTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check-out Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="availableFrom"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Available From (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availableUntil"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Available Until (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 6:
        const formData = form.getValues();
        return (
          <div className="space-y-6">
            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Review Your Listing</h3>
              
              <div className="grid gap-4">
                <div>
                  <span className="font-medium">Property:</span> {formData.title}
                </div>
                <div>
                  <span className="font-medium">Type:</span> {formData.propertyType}
                </div>
                <div>
                  <span className="font-medium">Location:</span> {formData.address}, {formData.city}
                </div>
                <div>
                  <span className="font-medium">Capacity:</span> {formData.bedrooms} bed, {formData.bathrooms} bath, {formData.maxGuests} guests
                </div>
                <div>
                  <span className="font-medium">Price:</span> ₦{formData.pricePerNight?.toLocaleString()}/night
                </div>
                <div>
                  <span className="font-medium">Stay Duration:</span> {formData.minimumStay}-{formData.maximumStay} nights
                </div>
                <div>
                  <span className="font-medium">Check Times:</span> In {formData.checkInTime}, Out {formData.checkOutTime}
                </div>
                <div>
                  <span className="font-medium">Photos:</span> {formData.photos?.length} uploaded
                </div>
                <div>
                  <span className="font-medium">Amenities:</span> {formData.amenities?.length} selected
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">Ready to publish!</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                Your listing will be reviewed and go live within 24 hours.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/host/create-listing-prompt')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Create Shortlet Listing</h1>
              <p className="text-muted-foreground">Step {currentStep} of {steps.length}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-600">Shortlet Property</span>
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
                {renderStepContent()}

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
                        (currentStep === 3 && uploadedPhotos.length < 5) ||
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