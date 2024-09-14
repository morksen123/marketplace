import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { forgotPasswordDefaultValues } from '@/features/Authentication/constants';
import { useAuthActions } from '@/features/Authentication/hooks/useAuthActions';
import { forgotPasswordSchema } from '@/features/Authentication/schema';
import {
  ForgotPasswordFormValues,
  RoleTypes,
} from '@/features/Authentication/types/auth';
import { capitalizeFirstLetter } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation } from 'react-router-dom';

export const ForgotPasswordRoute = () => {
  const location = useLocation();
  const { role } = location.state as { role: RoleTypes };

  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword } = useAuthActions();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: forgotPasswordDefaultValues,
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    await resetPassword({ email: data.email, role });
    setIsSubmitted(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
        <Link
          to="/"
          className="flex items-center text-sm text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </Link>

        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

        {isSubmitted ? (
          <Alert className="mb-4">
            <AlertDescription>
              If an account exists for <b>{form.getValues().email}</b>, we have
              sent password reset instructions to this email address.
            </AlertDescription>
          </Alert>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{capitalizeFirstLetter(role)} Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                variant="warning"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? 'Sending...'
                  : 'Send Reset Instructions'}
              </Button>
            </form>
          </Form>
        )}

        <p className="mt-4 text-sm text-center text-gray-600">
          Remember your password?{' '}
          <Link to="/" className="text-authYellow hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
