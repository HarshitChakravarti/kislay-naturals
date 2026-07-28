'use client';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import ClientOnly from '@/components/ClientOnly';
import { createClient } from '@/utils/supabase/client';

interface LoginFormData {
  emailOrUsername: string;
  password: string;
}

interface ValidationErrors {
  emailOrUsername?: string;
  password?: string;
}

function LoginForm() {
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    emailOrUsername: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.emailOrUsername) {
      errors.emailOrUsername = 'Email or username is required';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.emailOrUsername,
        password: formData.password,
      });

      if (signInError) throw signInError;

      toast.success('Successfully logged in');
      const callbackUrl = searchParams?.get('callbackUrl') || '/';
      router.push(callbackUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="emailOrUsername">Email</Label>
            <Input
              id="emailOrUsername"
              type="email"
              value={formData.emailOrUsername}
              onChange={(e) => handleInputChange('emailOrUsername', e.target.value)}
              placeholder="Enter your email"
              className={validationErrors.emailOrUsername ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {validationErrors.emailOrUsername && (
              <p className="text-sm text-red-500">{validationErrors.emailOrUsername}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password"
                className={validationErrors.password ? 'border-red-500 pr-10' : 'pr-10'}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-sm text-red-500">{validationErrors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function LoginFormWrapper() {
  return (
    <ClientOnly>
      <LoginForm />
    </ClientOnly>
  );
}