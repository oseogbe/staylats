import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { MultiSelect } from '@/components/MultiSelect';
import { useEffect } from 'react';

import { contractTerms } from './types';
import type { StepProps } from './types';

export function Pricing({ form }: StepProps) {
  // Convert contractTerms to MultiSelect format
  const contractOptions = contractTerms.map(term => ({
    label: term.label,
    value: term.value
  }));

  // Watch contract terms to sync pricing object
  const selectedContractTerms = form.watch('contractTerms') as string[] || [];

  // Sync pricing object when contract terms change
  useEffect(() => {
    const currentPricing = form.getValues('pricing') as Record<string, number> || {};
    const newPricing: Record<string, number> = {};

    // Keep pricing for still-selected terms, only include if it has a value
    selectedContractTerms.forEach(term => {
      if (currentPricing[term] !== undefined && currentPricing[term] > 0) {
        newPricing[term] = currentPricing[term];
      }
    });

    // Only update if there's a change (don't validate during sync)
    if (JSON.stringify(newPricing) !== JSON.stringify(currentPricing)) {
      form.setValue('pricing', newPricing, { shouldValidate: false });
    }
  }, [selectedContractTerms, form]);

  // Get label for a contract term value
  const getTermLabel = (termValue: string) => {
    const term = contractTerms.find(t => t.value === termValue);
    return term ? term.label : termValue;
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="contractTerms"
        render={({ field }) => {
          // Convert array to Set for MultiSelect
          const fieldValue = field.value as string[] | undefined;
          const selectedValues = new Set<string>(fieldValue || []);
          
          const handleSelectionChange = (newSelectedValues: Set<string>) => {
            // Convert Set back to array for form
            field.onChange(Array.from(newSelectedValues));
          };

          return (
            <FormItem>
              <FormLabel>Available Contract Terms</FormLabel>
              <FormDescription>Select all contract durations you're willing to offer</FormDescription>
              <FormControl>
                <MultiSelect
                  placeholder="Select contract terms..."
                  options={contractOptions}
                  selectedValues={selectedValues}
                  onSelectionChange={handleSelectionChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      {/* Dynamically generate pricing fields for each selected contract term */}
      {selectedContractTerms.length > 0 && (
        <FormField
          control={form.control}
          name="pricing"
          render={({ field, fieldState }) => (
            <FormItem>
              <div className="space-y-4">
                <div>
                  <FormLabel>Rental Charges</FormLabel>
                  <FormDescription>Set the rental price for each contract term</FormDescription>
                </div>
                {selectedContractTerms.map((term) => {
                  const termLabel = getTermLabel(term);
                  const currentPrice = field.value?.[term] || 0;
                  return (
                    <div key={term} className="space-y-2">
                      <FormLabel>{termLabel} (₦)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1000"
                          step="1000"
                          placeholder="50000"
                          value={currentPrice > 0 ? currentPrice : ''}
                          onChange={(e) => {
                            const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                            // Update the pricing object
                            const currentPricing = field.value || {};
                            const updatedPricing = { ...currentPricing, [term]: value };
                            field.onChange(updatedPricing);
                          }}
                        />
                      </FormControl>
                      <FormDescription>Set the rental price for {termLabel.toLowerCase()}</FormDescription>
                    </div>
                  );
                })}
              </div>
              {/* Only show error message once for the entire pricing field */}
              {fieldState.error && (
                <p className="text-sm font-medium text-destructive mt-2">
                  {fieldState.error.message}
                </p>
              )}
            </FormItem>
          )}
        />
      )}

      {/* Inspection Fee */}
      <FormField
        control={form.control}
        name="inspectionFee"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Inspection Fee (₦) <span className="text-xs text-muted-foreground">(optional)</span></FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                step="500"
                placeholder="20000"
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value === '' ? undefined : (parseInt(e.target.value) || 0))}
              />
            </FormControl>
            <FormDescription>Optional fee charged for property inspection</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Service Charge */}
      <FormField
        control={form.control}
        name="serviceCharge"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service Charge (₦) <span className="text-xs text-muted-foreground">(optional)</span></FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                step="1000"
                placeholder="50000"
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value === '' ? undefined : (parseInt(e.target.value) || 0))}
              />
            </FormControl>
            <FormDescription>Optional annual service charge for maintenance and utilities</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tenancy Agreement (PDF) */}
      <FormField
        control={form.control}
        name="tenancyAgreementFile"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Upload Tenancy Agreement <span className="text-xs text-muted-foreground">(PDF only)</span></FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0] ? e.target.files[0] : undefined;
                  field.onChange(file);
                }}
              />
            </FormControl>
            {fieldState.error && (
              <p className="text-sm font-medium text-destructive mt-1">{fieldState.error.message}</p>
            )}
            <FormDescription>Attach a sample tenancy agreement to share with applicants</FormDescription>
          </FormItem>
        )}
      />

      {/* Required Documents */}
      <FormField
        control={form.control}
        name="requiredDocuments"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Required Documents</FormLabel>
            <FormDescription>List documents applicants must provide (e.g., ID, Proof of Income, Guarantor)</FormDescription>
            <div className="space-y-2">
              {(field.value ?? ['']).map((doc: string, idx: number) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    placeholder="Document name"
                    value={doc}
                    onChange={(e) => {
                      const next = [...(field.value ?? [])]
                      next[idx] = e.target.value
                      field.onChange(next)
                    }}
                  />
                  <button
                    type="button"
                    className="px-3 py-2 border rounded-md"
                    onClick={() => field.onChange([...(field.value ?? []), ''])}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="px-3 py-2 border rounded-md"
                    onClick={() => {
                      const next = [...(field.value ?? [])]
                      next.splice(idx, 1)
                      field.onChange(next.length === 0 ? [''] : next)
                    }}
                    disabled={(field.value ?? ['']).length === 1}
                  >
                    -
                  </button>
                </div>
              ))}
            </div>
            {fieldState.error && (
              <p className="text-sm font-medium text-destructive mt-1">{fieldState.error.message}</p>
            )}
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
                placeholder="100000"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            </FormControl>
            <FormDescription>One-time security deposit (caution fee) amount</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="agentPercentage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Agent Percentage (%)</FormLabel>
            <FormControl>
              <div className="px-3">
                <Slider
                  min={0}
                  max={20}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>0%</span>
                  <span className="font-medium">{field.value}%</span>
                  <span>20%</span>
                </div>
              </div>
            </FormControl>
            <FormDescription>Agent commission as percentage of rent</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
