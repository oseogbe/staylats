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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-end sm:gap-4">
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
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Maximum occupants</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FormField
            control={form.control}
            name="maxAdults"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel>Adults</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="2"
                    className="min-w-0"
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
            name="maxKids"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel>Kids</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="min-w-0"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxInfants"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel>Infants</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="min-w-0"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allowPets"
            render={({ field }) => (
              <FormItem className="flex min-w-0 flex-col justify-end">
                <FormLabel>Pets allowed</FormLabel>
                <FormControl>
                  <Select
                    value={field.value ? "yes" : "no"}
                    onValueChange={(val) => field.onChange(val === "yes")}
                  >
                    <SelectTrigger className="min-w-0 w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
