import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Mail, ArrowLeft, RefreshCw } from 'lucide-react';

export default function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [canResend, setCanResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { verifyEmail } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (token) {
      handleVerification(token);
    }
  }, [token]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCooldown]);

  const handleVerification = async (verificationToken: string) => {
    setIsVerifying(true);
    try {
      await verifyEmail(verificationToken);
      setVerificationStatus('success');
      toast({
        title: 'Email verified!',
        description: 'Your email has been successfully verified.',
      });
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      setVerificationStatus('error');
      toast({
        title: 'Verification failed',
        description: 'The verification link may be invalid or expired.',
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    if (!canResend) return;
    
    setCanResend(false);
    setResendCooldown(60); // 60 second cooldown
    
    try {
      // In a real app, this would call the API to resend verification email
      toast({
        title: 'Verification email sent',
        description: 'Please check your email for a new verification link.',
      });
    } catch (error) {
      toast({
        title: 'Failed to resend email',
        description: 'Please try again or contact support.',
        variant: 'destructive',
      });
      setCanResend(true);
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'success':
        return <CheckCircle className="h-16 w-16 text-winbro-success" />;
      case 'error':
        return <XCircle className="h-16 w-16 text-destructive" />;
      default:
        return <Mail className="h-16 w-16 text-winbro-teal" />;
    }
  };

  const getStatusTitle = () => {
    switch (verificationStatus) {
      case 'success':
        return 'Email Verified!';
      case 'error':
        return 'Verification Failed';
      default:
        return 'Verify Your Email';
    }
  };

  const getStatusDescription = () => {
    switch (verificationStatus) {
      case 'success':
        return 'Your email has been successfully verified. You will be redirected to the dashboard shortly.';
      case 'error':
        return 'The verification link is invalid or has expired. Please request a new verification email.';
      default:
        return 'We\'ve sent a verification link to your email address. Please check your inbox and click the link to verify your account.';
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center text-winbro-teal hover:text-winbro-teal/80 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {isVerifying ? (
                <RefreshCw className="h-16 w-16 text-winbro-teal animate-spin" />
              ) : (
                getStatusIcon()
              )}
            </div>
            <CardTitle className="text-2xl">{getStatusTitle()}</CardTitle>
            <CardDescription className="text-base">
              {getStatusDescription()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {email && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Verification email sent to: <strong>{email}</strong>
                </p>
              </div>
            )}

            {verificationStatus === 'pending' && (
              <div className="space-y-4">
                <Alert>
                  <Mail className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Didn't receive the email?</strong> Check your spam folder or try resending the verification email.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Button
                    onClick={handleResendVerification}
                    disabled={!canResend}
                    className="w-full"
                    variant="outline"
                  >
                    {canResend ? (
                      'Resend Verification Email'
                    ) : (
                      `Resend in ${resendCooldown}s`
                    )}
                  </Button>
                  
                  <Link to="/login">
                    <Button variant="ghost" className="w-full">
                      Back to Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {verificationStatus === 'success' && (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Success!</strong> Your email has been verified. You will be redirected to the dashboard automatically.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Button
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-winbro-teal hover:bg-winbro-teal/90"
                  >
                    Go to Dashboard
                  </Button>
                  
                  <Link to="/login">
                    <Button variant="outline" className="w-full">
                      Sign In Instead
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {verificationStatus === 'error' && (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Verification failed.</strong> The link may be invalid or expired. Please request a new verification email.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Button
                    onClick={handleResendVerification}
                    disabled={!canResend}
                    className="w-full"
                  >
                    {canResend ? (
                      'Request New Verification Email'
                    ) : (
                      `Request in ${resendCooldown}s`
                    )}
                  </Button>
                  
                  <Link to="/login">
                    <Button variant="outline" className="w-full">
                      Back to Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Need help?{' '}
            <Link to="/help" className="text-winbro-teal hover:text-winbro-teal/80">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}