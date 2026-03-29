import { Bed, Bath, Users } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { propertyTypes } from './types';
import type { StepProps } from './types';

export function PropertyBasics({ form }: StepProps) {
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-end sm:gap-4">
        <FormField
          control={form.control}
          name="bedrooms"
          render={({ field }) => (
            <FormItem className="min-w-0">
              <FormLabel>Bedrooms</FormLabel>
              <FormControl>
                <div className="flex min-w-0 items-center gap-2">
                  <Bed className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <Input
                    type="number"
                    min="1"
                    className="min-w-0"
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
            <FormItem className="min-w-0">
              <FormLabel>Bathrooms</FormLabel>
              <FormControl>
                <div className="flex min-w-0 items-center gap-2">
                  <Bath className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <Input
                    type="number"
                    min="1"
                    className="min-w-0"
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
            <FormItem className="min-w-0">
              <FormLabel className="leading-snug">Max occupants</FormLabel>
              <FormControl>
                <div className="flex min-w-0 items-center gap-2">
                  <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <Input
                    type="number"
                    min="1"
                    className="min-w-0"
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
}
