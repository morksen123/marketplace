import { FileUpload } from '@/components/common/FileUpload';
import { LoadingSpinnerSvg } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { uploadFileToS3 } from '@/lib/aws';
import { zodResolver } from '@hookform/resolvers/zod';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import logo from '../../../assets/gudfood-logo-small.png';
import { distributorSignUpFormDefaultValues } from '../constants';
import { useAuthActions } from '../hooks/useAuthActions';
import { DistributorSignUpSchema } from '../schema';
import { DistributorRegisterForm } from '../types/auth';
import { EmailMessageModal } from './EmailMessageModal';

export const DistributorSignUpForm = () => {
  const { registerDistributor } = useAuthActions();

  const [acraProfile, setAcraProfile] = useState<File>();
  const [proofOfAddress, setProofOfAddress] = useState<File>();

  const form = useForm<DistributorRegisterForm>({
    resolver: zodResolver(DistributorSignUpSchema),
    defaultValues: distributorSignUpFormDefaultValues,
  });

  const isFormSubmitting = form.formState.isSubmitting;

  const handleDistributorSignUp = async (data: DistributorRegisterForm) => {
    try {
      if (proofOfAddress) {
        const proofOfAddressUrl = await uploadFileToS3(
          proofOfAddress,
          `proof_of_address_${Date.now()}`,
        );
        data.proofOfAddress = proofOfAddressUrl;
      }

      if (acraProfile) {
        const acraProfileUrl = await uploadFileToS3(
          acraProfile,
          `acra_profile_${Date.now()}`,
        );
        data.bizProfile = acraProfileUrl;
      }

      await registerDistributor(data);
    } catch (error) {
      console.error('Error during sign-up:', error);
    }
  };

  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    const fieldsToValidate: (keyof DistributorRegisterForm)[] = [
      'distributorName',
      'uen',
      'address',
      'contactName',
      'email',
      'contactNumber',
      'username',
      'password',
      'confirmPassword',
    ];

    form.trigger(fieldsToValidate).then((isValid) => {
      if (isValid) {
        setCurrentStep(currentStep + 1);
      }
    });
  };

  const prevStep = () => setCurrentStep(currentStep - 1);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl relative">
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
          <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-lg border-2 border-gray-200">
            <img src={logo} alt="GudFood Logo" className="w-20 h-20" />
          </div>
        </div>
        <CardHeader className="pt-20">
          <CardTitle className="text-2xl font-bold text-center">
            Join as a Distributor
          </CardTitle>
          <p className="text-center mt-2">
            Create an Account to Sell Smart, Save More, and Reduce Waste!
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleDistributorSignUp)}
              className="space-y-6"
            >
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="distributorName"
                      render={({ field }) => (
                        <FormItem className="text-left block">
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter company name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="uen"
                      render={({ field }) => (
                        <FormItem className="text-left block">
                          <FormLabel>
                            Business Registration Number (UEN/ROC)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your business registration number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="text-left block">
                          <FormLabel>Company Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123 Business St, City, 621338"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contactName"
                      render={({ field }) => (
                        <FormItem className="text-left block">
                          <FormLabel>Primary Contact Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter contact name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="text-left block">
                          <FormLabel>Primary Contact Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="contact@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contactNumber"
                      render={({ field }) => (
                        <FormItem className="text-left block">
                          <FormLabel>Primary Contact Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              type="contactNumber"
                              placeholder="91234567"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem className="text-left block">
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              type="username"
                              placeholder="Enter username"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="text-left block">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="text-left block">
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-center">
                    Document Upload
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="proofOfAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Proof of Address</FormLabel>
                          <FormControl>
                            <FileUpload
                              onFileSelect={(file) => {
                                setProofOfAddress(file);
                                field.onChange(file);
                              }}
                              label="Drag and drop proof of address here, or click to select"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bizProfile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ACRA Business Profile</FormLabel>
                          <FormControl>
                            <FileUpload
                              onFileSelect={(file) => {
                                setAcraProfile(file);
                                field.onChange(file);
                              }}
                              label="Drag and drop ACRA business profile here, or click to select"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-6">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="outline"
                    className="w-12 h-12 rounded-full"
                  >
                    <ArrowBackOutlinedIcon />
                  </Button>
                )}
                {currentStep < 2 && (
                  <Button
                    type="button"
                    onClick={nextStep}
                    variant="outline"
                    className="w-12 h-12 rounded-full ml-auto"
                  >
                    <ArrowForwardOutlinedIcon />
                  </Button>
                )}
                {currentStep === 2 && (
                  <Button
                    variant="secondary"
                    type="submit"
                    disabled={isFormSubmitting}
                    className="w-1/4 ml-auto"
                  >
                    {isFormSubmitting ? (
                      <LoadingSpinnerSvg size={24} />
                    ) : (
                      'Register as Distributor'
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <EmailMessageModal />
    </div>
  );
};
