import { CheckCircle } from 'lucide-react';
import type { StepProps } from './types';

export function Review({ form }: StepProps) {
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
          Your listing will be reviewed and go live within 24 hours once approved.
        </p>
      </div>
    </div>
  );
}
