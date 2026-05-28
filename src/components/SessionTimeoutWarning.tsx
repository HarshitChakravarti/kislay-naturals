'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface SessionTimeoutWarningProps {
  onExtendSession: () => void;
  onLogout: () => void;
  timeRemaining: number;
}

export default function SessionTimeoutWarning({ 
  onExtendSession, 
  onLogout, 
  timeRemaining 
}: SessionTimeoutWarningProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(timeRemaining);
  const { validateServerAuth } = useAuth();

  useEffect(() => {
    if (timeRemaining > 0) {
      setIsVisible(true);
      setCountdown(timeRemaining);
    } else {
      setIsVisible(false);
    }
  }, [timeRemaining]);

  useEffect(() => {
    if (!isVisible || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1000) {
          setIsVisible(false);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, countdown]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleExtendSession = async () => {
    try {
      const result = await validateServerAuth();
      if (result.success) {
        onExtendSession();
        setIsVisible(false);
      } else {
        onLogout();
      }
    } catch (error) {
      console.error('Failed to extend session:', error);
      onLogout();
    }
  };

  if (!isVisible || countdown <= 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">
                Session Timeout Warning
              </h3>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Your session will expire in:
            </p>
            <div className="text-2xl font-sans font-bold text-red-600 text-center">
              {formatTime(countdown)}
            </div>
            <p className="text-xs text-gray-500 text-center mt-1">
              Click &quot;Extend Session&quot; to continue working
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleExtendSession}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            >
              Extend Session
            </button>
            <button
              onClick={onLogout}
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
