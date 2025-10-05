'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ClientOnly from '@/components/ClientOnly';

function TestAuthPage() {
  const { user, isLoading, logout, showToast } = useAuth();

  const handleTestToast = () => {
    showToast('This is a test toast message!', 'success');
  };

  const handleTestErrorToast = () => {
    showToast('This is a test error message!', 'error');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Test Page</CardTitle>
              <CardDescription>
                Test the authentication system functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {user ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-medium text-green-800 mb-2">✅ Logged In</h3>
                    <div className="text-sm text-green-700 space-y-1">
                      <p><strong>Username:</strong> {user.username}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>User ID:</strong> {user._id}</p>
                      <p><strong>Created:</strong> {new Date(user.createdAt || '').toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button onClick={handleTestToast} variant="outline">
                      Test Success Toast
                    </Button>
                    <Button onClick={handleTestErrorToast} variant="outline">
                      Test Error Toast
                    </Button>
                    <Button 
                      onClick={logout}
                      variant="destructive"
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-medium text-yellow-800 mb-2">⚠️ Not Logged In</h3>
                    <p className="text-sm text-yellow-700">
                      You are not currently logged in. Please use the navigation menu to sign in or create an account.
                    </p>
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button onClick={handleTestToast} variant="outline">
                      Test Success Toast
                    </Button>
                    <Button onClick={handleTestErrorToast} variant="outline">
                      Test Error Toast
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-3">Authentication System Features:</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>✅ User registration with username, email, and password</li>
                  <li>✅ Login with email or username</li>
                  <li>✅ JWT token authentication</li>
                  <li>✅ Secure HTTP-only cookies</li>
                  <li>✅ CSRF protection</li>
                  <li>✅ Rate limiting</li>
                  <li>✅ Password hashing with bcrypt</li>
                  <li>✅ MongoDB Atlas integration</li>
                  <li>✅ Toast notifications</li>
                  <li>✅ Loading states</li>
                  <li>✅ Error handling</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function TestAuthPageWrapper() {
  return (
    <ClientOnly>
      <TestAuthPage />
    </ClientOnly>
  );
} 