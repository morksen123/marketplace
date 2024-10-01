import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { emailModalOpenAtom, userEmailAtom } from '@/store/emailModalAtom';
import { useAtom } from 'jotai';
import { CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EmailMessageModal = () => {
  const [isOpen, setIsOpen] = useAtom(emailModalOpenAtom);
  const [userEmail] = useAtom(userEmailAtom);
  const navigate = useNavigate();

  const onClose = () => {
    setIsOpen(false);
    navigate('/');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Complete Account Setup
          </DialogTitle>
          <DialogDescription className="text-center">
            We've emailed instructions for setting up your Stripe account.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
            <CreditCard className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-grow">
            <p className="text-sm font-medium text-gray-900">{userEmail}</p>
            <p className="text-sm text-gray-500">
              Check your inbox for the Stripe setup link.
            </p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-600 text-center">
            Follow the instructions to complete your account registration and
            start receiving payments.
          </p>
        </div>
        <div className="mt-4 flex flex-col space-y-2">
          <Button
            variant="secondary"
            onClick={() => window.open('https://mail.google.com', '_blank')}
          >
            Open Gmail
          </Button>
          <Button variant="outline" onClick={onClose}>
            I'll set up later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
