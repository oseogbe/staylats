import { Input } from '@/components/ui/input';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import { RichTextEditor } from '@/components/RichTextEditor';
import { PropertyPhotosField } from '@/components/listing/PropertyPhotosField';

import type { StepProps } from './types';

export function Photos({ form, photoUploadHook }: StepProps) {
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
            <FormLabel>Property Description <span className="text-xs text-muted-foreground">(optional)</span></FormLabel>
            <FormControl>
              <RichTextEditor
                value={field.value || ""}
                placeholder=""
                maxLength={1000}
                className="min-h-[120px]"
                onChange={(value) => {
                  // Check if the value is just empty HTML tags
                  const isEmptyHtml = value === '<p></p>' || value === '<p><br></p>' || value === '<p><br/></p>' || value === '';

                  if (isEmptyHtml) {
                    // Convert empty HTML to empty string for validation
                    field.onChange('');
                  } else {
                    field.onChange(value);
                  }
                }}
                onTextChange={() => {
                  // Trigger validation when text changes to get real-time feedback
                  form.trigger('description');
                }}
              />
            </FormControl>
            <FormDescription>
              Describe your property, its features, nearby attractions, and what makes it special for guests.
            </FormDescription>
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-md">
              <p className="text-amber-800 text-sm">
                <strong>⚠️ Important:</strong> Do not include contact information, phone numbers, email addresses, social media handles or location details in your description. This information will be handled separately through our secure contact and booking system.
              </p>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="houseRules"
        render={({ field }) => (
          <FormItem>
            <FormLabel>House Rules <span className="text-xs text-muted-foreground">(optional)</span></FormLabel>
            <FormControl>
              <RichTextEditor
                value={field.value || ""}
                placeholder="e.g., No smoking indoors, No parties or events, Quiet hours from 10 PM to 8 AM..."
                maxLength={500}
                className="min-h-[120px]"
                onChange={(value) => {
                  // Check if the value is just empty HTML tags
                  const isEmptyHtml = value === '<p></p>' || value === '<p><br></p>' || value === '<p><br/></p>' || value === '';

                  if (isEmptyHtml) {
                    // Convert empty HTML to empty string for validation
                    field.onChange('');
                  } else {
                    field.onChange(value);
                  }
                }}
                onTextChange={() => {
                  // Trigger validation when text changes to get real-time feedback
                  form.trigger('houseRules');
                }}
              />
            </FormControl>
            <FormDescription>
              Set clear expectations for guests by listing your property rules and guidelines.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <PropertyPhotosField form={form} photoUploadHook={photoUploadHook} />
    </div>
  );
}
