import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react';

const requestResetSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RequestResetForm = z.infer<typeof requestResetSchema>;
type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function PasswordResetPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const requestForm = useForm<RequestResetForm>({
    resolver: zodResolver(requestResetSchema),
  });

  const resetForm = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = resetForm.watch('password', '');
  const passwordStrength = getPasswordStrength(password);

  const onRequestReset = async (data: RequestResetForm) => {
    setIsLoading(true);
    try {
      await resetPassword(data.email);
      setIsRequestSent(true);
      toast({
        title: 'Reset email sent',
        description: 'Please check your email for password reset instructions.',
      });
    } catch (error) {
      toast({
        title: 'Failed to send reset email',
        description: 'Please try again or contact support if the problem persists.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onResetPassword = async (data: ResetPasswordForm) => {
    setIsLoading(true);
    try {
      // In a real app, this would call the API with the token
      toast({
        title: 'Password reset successful',
        description: 'Your password has been updated. You can now sign in.',
      });
      // Redirect to login
      window.location.href = '/login';
    } catch (error) {
      toast({
        title: 'Password reset failed',
        description: 'The reset link may have expired. Please request a new one.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  function getPasswordStrength(password: string) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  }

  const getStrengthText = (strength: number) => {
    if (strength < 2) return 'Weak';
    if (strength < 4) return 'Medium';
    return 'Strong';
  };

  if (isRequestSent && !token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center text-winbro-teal hover:text-winbro-teal/80 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <div className="mt-8">
              <div className="w-16 h-16 bg-winbro-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-winbro-success" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Check your email</h1>
              <p className="text-muted-foreground mt-2">
                We've sent password reset instructions to your email address.
              </p>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setIsRequestSent(false)}
                  className="w-full"
                >
                  Try Again
                </Button>
                <Link to="/login">
                  <Button variant="ghost" className="w-full">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center text-winbro-teal hover:text-winbro-teal/80 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-foreground mt-4">Reset your password</h1>
            <p className="text-muted-foreground mt-2">
              Enter your new password below
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>New Password</CardTitle>
              <CardDescription>
                Choose a strong password for your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={resetForm.handleSubmit(onResetPassword)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your new password"
                      className="pl-10 pr-10"
                      {...resetForm.register('password')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {password && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Password strength:</span>
                        <span className={passwordStrength >= 4 ? 'text-winbro-success' : passwordStrength >= 2 ? 'text-warning' : 'text-destructive'}>
                          {getStrengthText(passwordStrength)}
                        </span>
                      </div>
                      <Progress 
                        value={(passwordStrength / 5) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}
                  {resetForm.formState.errors.password && (
                    <p className="text-sm text-destructive">{resetForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your new password"
                      className="pl-10 pr-10"
                      {...resetForm.register('confirmPassword')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {resetForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">{resetForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-winbro-teal hover:bg-winbro-teal/90"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating password...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center text-winbro-teal hover:text-winbro-teal/80 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-foreground mt-4">Reset your password</h1>
          <p className="text-muted-foreground mt-2">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Forgot Password?</CardTitle>
            <CardDescription>
              No worries, we'll send you reset instructions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={requestForm.handleSubmit(onRequestReset)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="pl-10"
                    {...requestForm.register('email')}
                  />
                </div>
                {requestForm.formState.errors.email && (
                  <p className="text-sm text-destructive">{requestForm.formState.errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-winbro-teal hover:bg-winbro-teal/90"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login">
                <Button variant="ghost" className="w-full">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Alert>
          <AlertDescription>
            <strong>Security Note:</strong> Password reset links expire after 1 hour for your security. 
            If you don't receive the email, check your spam folder or contact support.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}