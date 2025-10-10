'use client';

import { useAuth } from '@/contexts/AuthContext';
import SessionTimeoutWarning from './SessionTimeoutWarning';

export default function SessionManager() {
  const { 
    sessionState, 
    extendSession, 
    logout, 
    user 
  } = useAuth();

  // Don't show session management for unauthenticated users
  if (!user) return null;

  const handleExtendSession = async () => {
    const success = await extendSession();
    if (!success) {
      await logout();
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {sessionState.warningShown && sessionState.timeUntilExpiry > 0 && (
        <SessionTimeoutWarning
          onExtendSession={handleExtendSession}
          onLogout={handleLogout}
          timeRemaining={sessionState.timeUntilExpiry}
        />
      )}
    </>
  );
}
