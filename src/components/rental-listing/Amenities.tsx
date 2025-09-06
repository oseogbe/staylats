import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { amenitiesList } from './types';
import type { StepProps } from './types';

export function Amenities({ form }: StepProps) {
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
                              : field.onChange(field.value?.filter((value: string) => value !== amenity))
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
}
