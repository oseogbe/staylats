import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { PlacesAutocomplete } from '@/components/PlacesAutocomplete';

import { states, type StepProps } from './types';

export function Location({ form }: StepProps) {

  const handlePlaceSelect = (place: {
    address: string
    coordinates: { lat: number; lng: number }
    components: google.maps.GeocoderAddressComponent[]
  }) => {
    const cityComponent = place.components.find(component => 
      component.types.includes('neighborhood') || component.types.includes('political')
    )
    const stateComponent = place.components.find(component => 
      component.types.includes('locality') || component.types.includes('administrative_area_level_2')
    )

    if (cityComponent) {
      form.setValue('city', cityComponent.long_name)
    }
    if (stateComponent) {
      const stateName = stateComponent.long_name
      const matchedState = states.find(state => 
        state.toLowerCase().includes(stateName.toLowerCase()) ||
        stateName.toLowerCase().includes(state.toLowerCase())
      )
      if (matchedState) {
        form.setValue('state', matchedState)
      } else {
        form.setValue('state', stateName)
      }
    }

    form.setValue('latitude', place.coordinates.lat)
    form.setValue('longitude', place.coordinates.lng)
  }

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Address</FormLabel>
            <FormControl>
              <PlacesAutocomplete
                value={field.value || ''}
                onChange={field.onChange}
                onPlaceSelect={handlePlaceSelect}
                placeholder="Search for an address..."
                restrictToCities={['Lagos', 'Abuja']}
              />
            </FormControl>
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
                <Input 
                  {...field}
                />
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}