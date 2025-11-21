import { useState, useEffect } from 'react';
import { Upload, FileText, Image, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { StepProps } from './types';

export function PropertyVerification({ form }: StepProps) {
  const [proofOfVisitPreview, setProofOfVisitPreview] = useState<string | null>(null);
  const [utilityBillPreview, setUtilityBillPreview] = useState<string | null>(null);

  // Load existing files from form values when component mounts (for navigation back)
  useEffect(() => {
    const proofOfVisitFile = form.getValues('proofOfVisitFile');
    const utilityBillFile = form.getValues('utilityBillFile');

    // Restore proof of visit preview
    if (proofOfVisitFile && proofOfVisitFile instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofOfVisitPreview(reader.result as string);
      };
      reader.readAsDataURL(proofOfVisitFile);
    }

    // Restore utility bill preview
    if (utilityBillFile && utilityBillFile instanceof File) {
      if (utilityBillFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUtilityBillPreview(reader.result as string);
        };
        reader.readAsDataURL(utilityBillFile);
      } else if (utilityBillFile.type === 'application/pdf') {
        setUtilityBillPreview('pdf');
      }
    }
  }, [form]);

  const handleProofOfVisitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('proofOfVisitFile', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofOfVisitPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUtilityBillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('utilityBillFile', file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUtilityBillPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setUtilityBillPreview('pdf');
      }
    }
  };

  const removeProofOfVisit = () => {
    form.setValue('proofOfVisitFile', undefined);
    setProofOfVisitPreview(null);
  };

  const removeUtilityBill = () => {
    form.setValue('utilityBillFile', undefined);
    setUtilityBillPreview(null);
  };

  return (
    <div className="space-y-6">
      {/* Proof of Visit - REQUIRED */}
      <FormField
        control={form.control}
        name="proofOfVisitFile"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Proof of Visit (Required)
            </FormLabel>
            <FormDescription className="text-sm space-y-2">
              <p className="font-medium text-foreground">
                Take a photo of a paper with "STAYLATS" written in bold letters inside the property.
              </p>
              <p>This proves you have physical access to the property and helps prevent fake listings.</p>
              <p className="text-xs text-muted-foreground">
                Example: Hold a paper with "STAYLATS" written clearly in the living room, bedroom, or any room of the property.
              </p>
            </FormDescription>
            <FormControl>
              <div className="space-y-4">
                {!proofOfVisitPreview ? (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
                    <label htmlFor="proof-of-visit-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-10 w-10 text-muted-foreground" />
                        <div className="text-sm font-medium">Upload Photo</div>
                        <div className="text-xs text-muted-foreground">
                          PNG, JPG, or JPEG (max 5MB)
                        </div>
                      </div>
                      <input
                        id="proof-of-visit-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProofOfVisitChange}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="relative border rounded-lg overflow-hidden">
                    <img
                      src={proofOfVisitPreview}
                      alt="Proof of visit"
                      className="w-full h-64 object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeProofOfVisit}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-2 left-2 bg-green-500 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Uploaded
                    </div>
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Utility Bill - OPTIONAL */}
      <FormField
        control={form.control}
        name="utilityBillFile"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Utility Bill (Optional)
            </FormLabel>
            <FormDescription className="text-sm space-y-2">
              <p>Upload a recent utility bill (electricity, water, or waste management) for the property.</p>
              <p className="font-medium text-amber-600">
                While optional, providing this document significantly speeds up the verification process.
              </p>
            </FormDescription>
            <FormControl>
              <div className="space-y-4">
                {!utilityBillPreview ? (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
                    <label htmlFor="utility-bill-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-10 w-10 text-muted-foreground" />
                        <div className="text-sm font-medium">Upload Document</div>
                        <div className="text-xs text-muted-foreground">
                          PDF, PNG, JPG, or JPEG (max 5MB)
                        </div>
                      </div>
                      <input
                        id="utility-bill-upload"
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={handleUtilityBillChange}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="relative border rounded-lg overflow-hidden">
                    {utilityBillPreview === 'pdf' ? (
                      <div className="w-full h-32 bg-muted flex items-center justify-center">
                        <div className="text-center">
                          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">PDF Document</p>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={utilityBillPreview}
                        alt="Utility bill"
                        className="w-full h-64 object-cover"
                      />
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeUtilityBill}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-2 left-2 bg-green-500 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Uploaded
                    </div>
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          <strong>Why do we need this?</strong> These documents help us verify property authenticity and prevent 
          fraudulent listings. Your documents are securely stored and only reviewed by our verification team.
        </AlertDescription>
      </Alert>
    </div>
  );
}


