import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  /**
   * Whether the overlay is visible
   */
  isLoading: boolean;

  /**
   * The message to display under the spinner
   */
  message?: string;

  /**
   * Optional class name for the overlay container
   */
  className?: string;

  /**
   * Optional class name for the content container
   */
  contentClassName?: string;

  /**
   * Optional class name for the spinner
   */
  spinnerClassName?: string;

  /**
   * Optional class name for the message text
   */
  messageClassName?: string;
}

export function LoadingOverlay({
  isLoading,
  message,
  className,
  contentClassName,
  spinnerClassName,
  messageClassName
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
        className
      )}
    >
      <div 
        className={cn(
          "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background p-6 rounded-lg shadow-lg flex items-center space-x-4",
          contentClassName
        )}
      >
        <div 
          className={cn(
            "animate-spin rounded-full h-6 w-6 border-b-2 border-primary",
            spinnerClassName
          )} 
        />
        {message && (
          <p className={cn("text-lg font-medium", messageClassName)}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
