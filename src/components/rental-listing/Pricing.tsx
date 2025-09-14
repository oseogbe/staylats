import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { MultiSelect } from '@/components/MultiSelect';

import { contractTerms } from './types';
import type { StepProps } from './types';

export function Pricing({ form }: StepProps) {
  // Convert contractTerms to MultiSelect format
  const contractOptions = contractTerms.map(term => ({
    label: term.label,
    value: term.value
  }));

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

      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Monthly Rent (₦)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1000"
                step="1000"
                placeholder="50000"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            </FormControl>
            <FormDescription>Set your monthly rental price in Naira</FormDescription>
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
                placeholder="100000"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            </FormControl>
            <FormDescription>One-time security deposit amount</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="agentFee"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Agent Fee (%)</FormLabel>
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
            <FormDescription>Agent commission percentage of annual rent</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
