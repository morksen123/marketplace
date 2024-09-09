'use client';

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
import { z } from 'zod';
import { signInFormDefaultValues } from '../constants';
import { SignInSchema } from '../schema';

const SignInForm = () => {
  const form = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: signInFormDefaultValues,
  });

  const handleUserSignIn = async (data: z.infer<typeof SignInSchema>) => {
    console.log('sign in', data);
  };

  const isFormSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleUserSignIn)}
        className="space-y-6"
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isFormSubmitting}>
          {isFormSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;
