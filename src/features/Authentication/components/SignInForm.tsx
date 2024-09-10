import PersonOutlinedIcon from '@/assets/person.svg';
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
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { signInFormDefaultValues } from '../constants';
import { SignInSchema } from '../schema';
import { SignInFormState } from '../types/form-state';
import { CheckboxWithText } from './CheckBoxWithText';

type SignInFormProps = {
  state: SignInFormState;
  onClose: (state: SignInFormState) => void;
};

const FormHeader: React.FC<{ title: string; onClose: () => void }> = ({
  title,
  onClose,
}) => (
  <header className="w-full flex items-center justify-between mb-6 relative">
    <ArrowLeft onClick={onClose} className="cursor-pointer absolute left-0" />
    <div className="flex items-center justify-center w-full">
      <PersonOutlinedIcon />
      <h1 className="ml-2 text-lg font-semibold">{title}</h1>
    </div>
  </header>
);

const SignInForm: React.FC<SignInFormProps> = ({ state, onClose }) => {
  const form = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: signInFormDefaultValues,
  });

  const handleUserSignIn = async (data: z.infer<typeof SignInSchema>) => {
    console.log('sign in', data);
  };

  if (state === 'Closed') return null;

  return (
    <div className="bg-white rounded-lg shadow p-6 min-w-[25rem]">
      <FormHeader title={state} onClose={() => onClose('Closed')} />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUserSignIn)}
          className="space-y-3"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="text-left">
                <FormLabel className="font-semibold">Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="text-left">
                <FormLabel className="font-semibold">Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <CheckboxWithText text="Remember me" />

          <Button
            type="submit"
            variant="warning"
            className="w-full border-[1px]"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Logging in...' : 'Sign In'}
          </Button>
        </form>
      </Form>

      <footer className="text-center mt-4">
        <span className="text-primary-foreground">
          No account?{' '}
          <a href="/auth/register" className="text-authYellow hover:underline">
            Create an account
          </a>
        </span>
      </footer>
    </div>
  );
};

export default SignInForm;
