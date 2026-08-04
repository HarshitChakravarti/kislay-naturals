'use client';

import { useEffect } from 'react';
import { useMetaPixel } from '@/hooks/useMetaPixel';

/**
 * Fires a Meta Conversions API "Contact" event when the user views the
 * contact-us page. This is a page-view signal, not form-submission dependent.
 */
export default function ContactPageTracker() {
  const { trackContact } = useMetaPixel();

  useEffect(() => {
    trackContact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null; // Renders nothing visible
}
