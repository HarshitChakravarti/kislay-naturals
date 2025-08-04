
import crypto from 'crypto';

interface CSRFStore {
  [key: string]: {
    token: string;
    expires: number;
  };
}

const csrfStore: CSRFStore = {};

export function generateCSRFToken(sessionId: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  csrfStore[sessionId] = {
    token,
    expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
  return token;
}

export function validateCSRFToken(sessionId: string, token: string): boolean {
  const stored = csrfStore[sessionId];
  if (!stored || stored.expires < Date.now()) {
    delete csrfStore[sessionId];
    return false;
  }
  
  const isValid = stored.token === token;
  if (isValid) {
    delete csrfStore[sessionId]; // Use once
  }
  return isValid;
}

export function getCSRFToken(sessionId: string): string | null {
  const stored = csrfStore[sessionId];
  if (!stored || stored.expires < Date.now()) {
    delete csrfStore[sessionId];
    return null;
  }
  return stored.token;
}

// Clean up expired tokens periodically
setInterval(() => {
  const now = Date.now();
  Object.keys(csrfStore).forEach(key => {
    if (csrfStore[key].expires < now) {
      delete csrfStore[key];
    }
  });
}, 60 * 60 * 1000); // Clean up every hour 