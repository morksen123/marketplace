import { Share as ShareIcon, ContentCopy as Copy, Facebook as FacebookIcon, LinkedIn as LinkedInIcon, Instagram as InstagramIcon } from '@mui/icons-material';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ShareProps {
  title?: string;
  description?: string;
  metrics?: {
    weightSaved?: number;
    co2Prevented?: number;
    treesEquivalent?: number;
    waterLitresSaved?: number;
    electricityDaysSaved?: number;
  };
  referralCode?: string;
  customMessage?: string;
}

export const ShareContent = ({ 
  title = "Share Your Impact", 
  description = "Share your environmental impact with friends!",
  metrics,
  referralCode,
  customMessage
}: ShareProps) => {
  const { toast } = useToast();
  
  const createShareMessage = () => {
    if (customMessage) return customMessage;
    
    let message = "I'm making a sustainable impact with GudFood! 🌱\n\n";
    
    if (metrics) {
      if (metrics.weightSaved) message += `• Prevented ${metrics.weightSaved.toFixed(2)}kg of food waste\n`;
      if (metrics.co2Prevented) message += `• Saved ${metrics.co2Prevented.toFixed(2)}kg of CO₂ emissions\n`;
      if (metrics.treesEquivalent) message += `• Equivalent to ${metrics.treesEquivalent.toFixed(1)} trees\n`;
      if (metrics.waterLitresSaved) message += `• Saved ${metrics.waterLitresSaved.toFixed(0)} litres of water\n`;
      if (metrics.electricityDaysSaved) message += `• Saved ${metrics.electricityDaysSaved.toFixed(1)} days of electricity\n`;
    }
    
    message += "\nJoin me in reducing food waste!";
    return message;
  };

  const shareToSocialMedia = (platform: 'linkedin' | 'facebook' | 'instagram') => {
    const message = createShareMessage();
    const baseUrl = window.location.origin;
    const shareUrl = referralCode ? `${baseUrl}/join?ref=${referralCode}` : baseUrl;

    switch (platform) {
      case 'linkedin':
        const linkedInUrl = new URL('https://www.linkedin.com/sharing/share-offsite/');
        linkedInUrl.searchParams.append('url', shareUrl);
        linkedInUrl.searchParams.append('summary', message);
        linkedInUrl.searchParams.append('source', 'GudFood');
        
        window.open(
          linkedInUrl.toString(),
          'LinkedInShare',
          'width=800,height=600,menubar=no,toolbar=no,status=no'
        );
        break;

      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(message)}`,
          '_blank',
          'width=600,height=600'
        );
        break;

      case 'instagram':
        navigator.clipboard.writeText(message).then(() => {
          toast({
            title: "Instagram Sharing",
            description: "Impact metrics copied! Share a screenshot of your stats along with the copied message on Instagram.",
            duration: 5000,
          });
        });
        break;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ShareIcon className="h-4 w-4 mr-2" />
          Share Impact
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => shareToSocialMedia('linkedin')}
            >
              <LinkedInIcon className="h-5 w-5 mr-2" />
              LinkedIn
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => shareToSocialMedia('facebook')}
            >
              <FacebookIcon className="h-5 w-5 mr-2" />
              Facebook
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => shareToSocialMedia('instagram')}
            >
              <InstagramIcon className="h-5 w-5 mr-2" />
              Instagram
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
