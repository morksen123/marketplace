import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { distributorSignUpFormDefaultValues } from '../constants';
import { DistributorSignUpSchema } from '../schema';
import { DistributorRegisterForm } from '../types/auth';

export const DistributorSignUpForm = () => {
  // const { registerDistributor } = useAuthActions();
  const form = useForm({
    resolver: zodResolver(DistributorSignUpSchema),
    defaultValues: distributorSignUpFormDefaultValues,
  });

  const handleDistributorSignUp = async (data: DistributorRegisterForm) => {
    console.log(data);
  };

  const isFormSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleDistributorSignUp)}
        className="text-left space-y-6"
      >
        {/* Company Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Company Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="ABC Corporation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="businessRegistrationNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Business Registration Number (UEN/ROC)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="201234567K" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="companyAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Company Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="123 Business St, #01-01, Singapore 123456"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Document Uploads */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Document Uploads</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="proofOfAddress"
              render={({ field: { onChange, ...rest } }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Proof of Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) =>
                        onChange(e.target.files ? e.target.files[0] : undefined)
                      }
                      {...rest}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="acraBusinessProfile"
              render={({ field: { onChange, ...rest } }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    ACRA Business Profile
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) =>
                        onChange(e.target.files ? e.target.files[0] : null)
                      }
                      {...rest}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Primary Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Primary Contact Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="primaryContactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Primary Contact Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="primaryContactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Primary Contact Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="primaryPhoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">
                  Primary Phone Number
                </FormLabel>
                <FormControl>
                  <Input placeholder="+65 1234 5678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Account Credentials */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Account Credentials</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button
            variant={'secondary'}
            type="submit"
            disabled={isFormSubmitting}
          >
            {isFormSubmitting ? 'Processing...' : 'Register as Distributor'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
