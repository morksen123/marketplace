import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const EmailVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<
    'loading' | 'success' | 'error'
  >('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const verificationAttempted = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      if (verificationAttempted.current) return;
      verificationAttempted.current = true;

      const token = searchParams.get('token');
      console.log('Token:', token);
      if (!token) {
        console.log('Token is missing');
        setVerificationStatus('error');
        setErrorMessage('Verification token is missing.');
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/buyer/verify?token=${token}`,
          {
            method: 'GET',
          },
        );

        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Response text:', responseText);

        if (response.ok) {
          console.log('Verification successful');
          setVerificationStatus('success');
        } else {
          console.log('Verification failed');
          setVerificationStatus('error');
          setErrorMessage(
            responseText || 'Verification failed. Please try again.',
          );
        }
      } catch (error) {
        console.error('Error during verification:', error);
        setVerificationStatus('error');
        setErrorMessage(
          'An error occurred during verification. Please try again later.',
        );
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-xl shadow-md">
        {verificationStatus === 'loading' && (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-lg font-semibold">Verifying your email...</p>
          </div>
        )}
        {verificationStatus === 'success' && (
          <Alert className="bg-green-100 border-green-500">
            <AlertTitle className="text-green-800">Success!</AlertTitle>
            <AlertDescription className="text-green-700">
              Your email has been successfully verified. You can now log in to
              your account.
            </AlertDescription>
          </Alert>
        )}
        {verificationStatus === 'error' && (
          <Alert variant="destructive">
            <AlertTitle>Verification Failed</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <Button className="w-full" variant="secondary" onClick={() => navigate('/')}>
          Go to Login
        </Button>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
