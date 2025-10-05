'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import ClientOnly from '@/components/ClientOnly';

interface LoginFormData {
  emailOrUsername: string;
  password: string;
}

interface ValidationErrors {
  emailOrUsername?: string;
  password?: string;
}

function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    emailOrUsername: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [isLoadingToken, setIsLoadingToken] = useState(true);

  // Generate CSRF token on component mount
  useEffect(() => {
    const generateCSRFToken = async () => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'GET',
          headers: {
            'x-session-id': 'login-form',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.csrfToken) {
          setCsrfToken(data.csrfToken);
          setIsLoadingToken(false);
        } else {
          console.error('No CSRF token received from server');
          setIsLoadingToken(false);
        }
      } catch (error) {
        console.error('Failed to generate CSRF token:', error);
        setIsLoadingToken(false);
        // Retry after a short delay
        setTimeout(() => {
          generateCSRFToken();
        }, 2000);
      }
    };

    generateCSRFToken();
  }, []);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Email/Username validation
    if (!formData.emailOrUsername) {
      errors.emailOrUsername = 'Email or username is required';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!csrfToken) {
      alert('CSRF token not available. Please refresh the page and try again.');
      return;
    }

    try {
      await login(formData.emailOrUsername, formData.password);
    } catch (error) {
      // Error is handled by the auth context
      console.error('Login error:', error);
    }
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field when user starts typing
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
            <Label htmlFor="emailOrUsername">Email or Username</Label>
            <Input
              id="emailOrUsername"
              type="text"
              value={formData.emailOrUsername}
              onChange={(e) => handleInputChange('emailOrUsername', e.target.value)}
              placeholder="Enter your email or username"
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
            disabled={isLoading || isLoadingToken || !csrfToken}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : isLoadingToken ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
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