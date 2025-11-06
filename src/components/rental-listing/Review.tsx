import { CheckCircle } from 'lucide-react';

import { contractTerms } from './types';
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
            <span className="font-medium">Contract Terms:</span> {
              formData.contractTerms && formData.contractTerms.length > 0 
                ? formData.contractTerms
                    .map(termValue => contractTerms.find(t => t.value === termValue)?.label)
                    .filter(Boolean)
                    .join(', ')
                : 'No contract terms selected'
            }
          </div>
          <div>
            <span className="font-medium">Rental Charges:</span>
            {formData.pricing && Object.keys(formData.pricing).length > 0 ? (
              <div className="mt-1 space-y-1">
                {Object.entries(formData.pricing).map(([term, price]) => {
                  const termLabel = contractTerms.find(t => t.value === term)?.label || term;
                  return (
                    <div key={term} className="text-sm">
                      {termLabel}: ₦{typeof price === 'number' ? price.toLocaleString() : '0'}
                    </div>
                  );
                })}
              </div>
            ) : (
              <span className="text-muted-foreground">No pricing set</span>
            )}
          </div>
          {formData.inspectionFee !== undefined && (
            <div>
              <span className="font-medium">Inspection Fee:</span> ₦{Number(formData.inspectionFee).toLocaleString()}
            </div>
          )}
          {formData.tenancyAgreement && (
            <div>
              <span className="font-medium">Tenancy Agreement:</span> Uploaded
            </div>
          )}
          {formData.requiredDocuments && formData.requiredDocuments.length > 0 && (
            <div>
              <span className="font-medium">Required Documents:</span>
              <div className="mt-1 text-sm">{formData.requiredDocuments.join(', ')}</div>
            </div>
          )}
          {formData.agentPercentage !== undefined && (
            <div>
              <span className="font-medium">Agent Percentage:</span> {formData.agentPercentage}%
            </div>
          )}
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
