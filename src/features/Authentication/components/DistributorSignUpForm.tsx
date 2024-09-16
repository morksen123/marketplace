import { FileUpload } from '@/components/common/FileUpload';
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
import { Separator } from '@/components/ui/separator';
import { uploadFileToS3 } from '@/lib/aws';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { distributorSignUpFormDefaultValues } from '../constants';
import { useAuthActions } from '../hooks/useAuthActions';
import { DistributorSignUpSchema } from '../schema';
import { DistributorRegisterForm } from '../types/auth';

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

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Distributor Registration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleDistributorSignUp)}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="distributorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="uen"
                  render={({ field }) => (
                    <FormItem>
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
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Company Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your company address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Contact Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter the name of the person managing the account"
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
                    <FormItem>
                      <FormLabel>Primary Contact Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter the email of the person managing the account"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Contact Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter the number of the person managing the account"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Account Credentials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="hidden md:block"></div>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
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
                    <FormItem>
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

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Document Upload</h3>
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
                          label="Drag 'n' drop proof of address here, or click to select"
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
                          label="Drag 'n' drop ACRA business profile here, or click to select"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button
                variant="secondary"
                type="submit"
                disabled={isFormSubmitting}
                className="w-full md:w-auto"
              >
                {isFormSubmitting ? 'Processing...' : 'Register as Distributor'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
