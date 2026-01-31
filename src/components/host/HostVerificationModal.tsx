import { useState } from 'react';
import { Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HostVerificationFormModal } from './HostVerificationFormModal';

interface HostVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HostVerificationModal({ open, onOpenChange }: HostVerificationModalProps) {
  const [showFormModal, setShowFormModal] = useState(false);

  const handleVerifyHost = () => {
    onOpenChange(false);
    setShowFormModal(true);
  };

  const handleLater = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Info className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl">Complete Host Verification</DialogTitle>
          </div>
          <DialogDescription className="text-left pt-2">
            <p className="text-base text-foreground mb-3">
              Your listing has been submitted for review! However, to ensure your listing can go live, 
              you need to complete your host verification.
            </p>
            <p className="text-sm text-muted-foreground">
              Complete your host profile verification to unlock all features and ensure your listings 
              can be approved and published.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleLater}
            className="w-full sm:w-auto"
          >
            I'll do it later
          </Button>
          <Button
            onClick={handleVerifyHost}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Verify Host Profile
          </Button>
        </DialogFooter>
      </DialogContent>
      <HostVerificationFormModal 
        open={showFormModal} 
        onOpenChange={setShowFormModal} 
      />
    </Dialog>
  );
}

