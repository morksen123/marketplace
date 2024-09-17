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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { buyerSignUpFormDefaultValues } from '../constants';
import { useAuthActions } from '../hooks/useAuthActions';
import { BuyerSignUpSchema } from '../schema';
import { BuyerRegisterForm } from '../types/auth';
import logo from '../../../assets/gudfood-logo-small.png';

export const BuyerSignUpForm = () => {
  const { registerBuyer } = useAuthActions();
  const form = useForm<BuyerRegisterForm>({
    resolver: zodResolver(BuyerSignUpSchema),
    defaultValues: buyerSignUpFormDefaultValues,
  });

  const handleBuyerSignUp = async (data: BuyerRegisterForm) => {
    await registerBuyer(data);
  };

  const isFormSubmitting = form.formState.isSubmitting;

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
            Join the <span className="font-bold">Gud</span>Food Movement
          </CardTitle>
          <p className="text-center mt-2">
            Create an Account to Buy Smart, Save More, and Reduce Waste!
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleBuyerSignUp)}
              className="space-y-6"
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="text-left block">
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="text-left block">
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="text-left block">
                        <FormLabel>Email Address</FormLabel>
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
                  <FormField
                    control={form.control}
                    name="homeAddress"
                    render={({ field }) => (
                      <FormItem className="text-left block">
                        <FormLabel>Home Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123 Main St, City, 621338"
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
              <div className="flex justify-center mt-6">
                <Button
                  variant="secondary"
                  type="submit"
                  disabled={isFormSubmitting}
                  className="w-full md:w-1/2 button button-green"
                >
                  {isFormSubmitting ? 'Processing...' : 'Register as Buyer'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
