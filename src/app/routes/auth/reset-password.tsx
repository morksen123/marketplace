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
import { resetPasswordDefaultValues } from '@/features/Authentication/constants';
import { useAuthActions } from '@/features/Authentication/hooks/useAuthActions';
import { resetPasswordSchema } from '@/features/Authentication/schema';
import {
  ResetPasswordFormValues,
  RoleTypes,
} from '@/features/Authentication/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';

export const ResetPasswordRoute = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') as string;
  const role = searchParams.get('role') as RoleTypes;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const { changePasswordAfterReset } = useAuthActions();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: resetPasswordDefaultValues,
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    await changePasswordAfterReset({ data, role, token });
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

        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        {isSubmitted ? (
          <Alert className="mb-4">
            <AlertDescription>
              Your password has been successfully reset. You can now log in with
              your new password.
            </AlertDescription>
          </Alert>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your new password"
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
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Confirm your new password"
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
                  ? 'Resetting...'
                  : 'Reset Password'}
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
