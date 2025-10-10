'use client';

import { validateToken, extractTokenFromRequest } from './tokenValidation';

export interface SessionConfig {
  refreshInterval: number; // milliseconds
  warningTime: number; // milliseconds before expiry to show warning
  maxInactivity: number; // milliseconds of inactivity before logout
  extendOnActivity: boolean; // whether to extend session on user activity
}

export interface SessionState {
  isActive: boolean;
  lastActivity: number;
  expiresAt: number | null;
  refreshToken: string | null;
  isRefreshing: boolean;
  warningShown: boolean;
  lastValidationAttempt: number;
  consecutiveFailures: number;
}

const DEFAULT_CONFIG: SessionConfig = {
  refreshInterval: 5 * 60 * 1000, // 5 minutes
  warningTime: 2 * 60 * 1000, // 2 minutes before expiry
  maxInactivity: 30 * 60 * 1000, // 30 minutes
  extendOnActivity: true
};

export class SessionManager {
  private config: SessionConfig;
  private state: SessionState;
  private refreshTimer: NodeJS.Timeout | null = null;
  private warningTimer: NodeJS.Timeout | null = null;
  private inactivityTimer: NodeJS.Timeout | null = null;
  private callbacks: {
    onSessionExpired: () => void;
    onSessionWarning: () => void;
    onSessionRefreshed: (newToken: string) => void;
    onSessionError: (error: string) => void;
  };

  constructor(
    config: Partial<SessionConfig> = {},
    callbacks: {
      onSessionExpired: () => void;
      onSessionWarning: () => void;
      onSessionRefreshed: (newToken: string) => void;
      onSessionError: (error: string) => void;
    }
  ) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.callbacks = callbacks;
    this.state = {
      isActive: false,
      lastActivity: Date.now(),
      expiresAt: null,
      refreshToken: null,
      isRefreshing: false,
      warningShown: false,
      lastValidationAttempt: 0,
      consecutiveFailures: 0
    };

    this.setupActivityTracking();
  }

  private setupActivityTracking() {
    if (typeof window === 'undefined') return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const updateActivity = () => {
      this.state.lastActivity = Date.now();
      
      if (this.config.extendOnActivity && this.state.isActive) {
        this.resetInactivityTimer();
      }
    };

    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });
  }

  public async initializeSession(): Promise<boolean> {
    try {
      console.log('Initializing session...');
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      console.log('Session initialization response:', response.status);

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          console.log('Session initialized successfully for user:', data.user.email);
          this.state.isActive = true;
          this.state.lastActivity = Date.now();
          this.state.expiresAt = this.calculateExpiryTime();
          this.startSessionTimers();
          return true;
        }
      } else if (response.status === 401) {
        // Token is invalid, don't retry immediately
        console.log('Session initialization failed: Invalid token (401)');
        this.clearSession();
        return false;
      }
      
      console.log('Session initialization failed: No valid user data');
      this.clearSession();
      return false;
    } catch (error) {
      console.error('Session initialization failed:', error);
      this.callbacks.onSessionError('Failed to initialize session');
      return false;
    }
  }

  public async refreshSession(): Promise<boolean> {
    if (this.state.isRefreshing) return false;

    // Implement cooldown to prevent excessive API calls
    const now = Date.now();
    const timeSinceLastAttempt = now - this.state.lastValidationAttempt;
    const cooldownTime = Math.min(30000, this.state.consecutiveFailures * 10000); // Max 30s cooldown

    if (timeSinceLastAttempt < cooldownTime) {
      console.log(`Session refresh on cooldown for ${cooldownTime - timeSinceLastAttempt}ms`);
      return false;
    }

    this.state.isRefreshing = true;
    this.state.lastValidationAttempt = now;

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          this.state.isActive = true;
          this.state.lastActivity = Date.now();
          this.state.expiresAt = this.calculateExpiryTime();
          this.state.warningShown = false;
          this.state.consecutiveFailures = 0; // Reset failure count on success
          
          this.callbacks.onSessionRefreshed(data.token || 'refreshed');
          this.startSessionTimers();
          return true;
        }
      }
      
      this.state.consecutiveFailures++;
      this.clearSession();
      this.callbacks.onSessionExpired();
      return false;
    } catch (error) {
      console.error('Session refresh failed:', error);
      this.state.consecutiveFailures++;
      this.callbacks.onSessionError('Failed to refresh session');
      this.clearSession();
      return false;
    } finally {
      this.state.isRefreshing = false;
    }
  }

  public async validateSession(): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/validate', {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          this.state.isActive = true;
          this.state.lastActivity = Date.now();
          this.state.expiresAt = this.calculateExpiryTime();
          return true;
        }
      }
      
      this.clearSession();
      return false;
    } catch (error) {
      console.error('Session validation failed:', error);
      this.clearSession();
      return false;
    }
  }

  public clearSession(): void {
    this.state.isActive = false;
    this.state.expiresAt = null;
    this.state.refreshToken = null;
    this.state.warningShown = false;
    this.state.consecutiveFailures = 0;
    this.state.lastValidationAttempt = 0;
    
    this.clearTimers();
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  }

  public getSessionState(): SessionState {
    return { ...this.state };
  }

  public isSessionActive(): boolean {
    return this.state.isActive && !this.isSessionExpired();
  }

  public isSessionExpired(): boolean {
    if (!this.state.expiresAt) return false;
    return Date.now() >= this.state.expiresAt;
  }

  public getTimeUntilExpiry(): number {
    if (!this.state.expiresAt) return 0;
    return Math.max(0, this.state.expiresAt - Date.now());
  }

  public getInactivityTime(): number {
    return Date.now() - this.state.lastActivity;
  }

  private calculateExpiryTime(): number {
    // Default to 1 hour from now, but this should be based on your token expiry
    return Date.now() + (60 * 60 * 1000);
  }

  private startSessionTimers(): void {
    this.clearTimers();
    
    if (!this.state.isActive) return;

    // Refresh timer
    this.refreshTimer = setInterval(() => {
      this.refreshSession();
    }, this.config.refreshInterval);

    // Warning timer - only set if we have a valid expiry time
    if (this.state.expiresAt && this.state.expiresAt > Date.now()) {
      const warningTime = this.state.expiresAt - this.config.warningTime;
      const timeUntilWarning = Math.max(0, warningTime - Date.now());
      
      if (timeUntilWarning > 0) {
        this.warningTimer = setTimeout(() => {
          if (this.state.isActive && !this.state.warningShown) {
            this.state.warningShown = true;
            this.callbacks.onSessionWarning();
          }
        }, timeUntilWarning);
      }
    }

    // Inactivity timer
    this.resetInactivityTimer();
  }

  private resetInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    this.inactivityTimer = setTimeout(() => {
      if (this.getInactivityTime() >= this.config.maxInactivity) {
        this.clearSession();
        this.callbacks.onSessionExpired();
      }
    }, this.config.maxInactivity);
  }

  private clearTimers(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
    
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }
    
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  public destroy(): void {
    this.clearSession();
    this.clearTimers();
  }
}
