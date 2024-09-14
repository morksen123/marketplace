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
import { capitalizeFirstLetter } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { signInFormDefaultValues } from '../constants';
import { useAuthActions } from '../hooks/useAuthActions';
import { SignInSchema } from '../schema';
import { LoginCredentials, RoleTypes, SignInFormState } from '../types/auth';
import { CheckboxWithText } from './CheckBoxWithText';
import { FormHeader } from './FormHeader';

type SignInFormProps = {
  userRole: RoleTypes;
  onClose: (state: SignInFormState) => void;
};

const SignInForm: React.FC<SignInFormProps> = ({ userRole, onClose }) => {
  const { login } = useAuthActions();
  const form = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: signInFormDefaultValues,
  });

  const handleUserSignIn = async (data: LoginCredentials) => {
    await login({ credentials: data, role: userRole });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 min-w-[25rem]">
      <FormHeader
        title={capitalizeFirstLetter(userRole)}
        onClose={() => onClose('CLOSED')}
      />
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
