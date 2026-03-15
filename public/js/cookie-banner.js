/**
 * DSGVO-compliant Cookie Banner
 * Handles cookie consent preferences and stores them locally
 */

(function() {
  'use strict';
  
  // Cookie consent storage key
  const CONSENT_KEY = 'federleicht_cookie_consent';
  
  // Consent states
  const CONSENT_STATES = {
    ESSENTIAL: 'essential',
    REJECTED: 'rejected',
    ACCEPTED: 'accepted'
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieBanner);
  } else {
    initCookieBanner();
  }
  
  function initCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    const btnAccept = document.getElementById('cookie-accept');
    const btnReject = document.getElementById('cookie-reject');
    const btnEssential = document.getElementById('cookie-essential');
    
    if (!banner || !btnAccept || !btnReject || !btnEssential) {
      console.warn('Cookie banner elements not found');
      return;
    }
    
    // Check for existing consent
    const existingConsent = getConsent();
    
    if (!existingConsent) {
      // Show banner after a short delay
      setTimeout(() => {
        banner.classList.remove('translate-y-full');
        banner.setAttribute('aria-hidden', 'false');
      }, 1000);
    } else {
      // Apply existing consent settings
      applyConsent(existingConsent);
      banner.setAttribute('aria-hidden', 'true');
    }
    
    // Event listeners
    btnAccept.addEventListener('click', () => setConsent(CONSENT_STATES.ACCEPTED));
    btnReject.addEventListener('click', () => setConsent(CONSENT_STATES.REJECTED));
    btnEssential.addEventListener('click', () => setConsent(CONSENT_STATES.ESSENTIAL));
    
    // Handle escape key to close banner
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !banner.classList.contains('translate-y-full')) {
        // Default to essential-only when escaping
        setConsent(CONSENT_STATES.ESSENTIAL);
      }
    });
  }
  
  /**
   * Set cookie consent preference
   */
  function setConsent(consentType) {
    const consent = {
      type: consentType,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    } catch (e) {
      console.warn('Could not save cookie consent to localStorage');
    }
    
    hideBanner();
    applyConsent(consent);
    
    // Dispatch custom event for other scripts
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { 
      detail: consent 
    }));
  }
  
  /**
   * Get stored consent preference
   */
  function getConsent() {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  }
  
  /**
   * Hide the cookie banner
   */
  function hideBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.classList.add('translate-y-full');
      banner.setAttribute('aria-hidden', 'true');
    }
  }
  
  /**
   * Apply consent settings (enable/disable tracking)
   */
  function applyConsent(consent) {
    if (!consent) return;
    
    switch (consent.type) {
      case CONSENT_STATES.ACCEPTED:
        enableAnalytics();
        enableMarketing();
        break;
        
      case CONSENT_STATES.ESSENTIAL:
        // Only essential cookies - no tracking
        disableAnalytics();
        disableMarketing();
        break;
        
      case CONSENT_STATES.REJECTED:
        disableAnalytics();
        disableMarketing();
        break;
    }
    
    // Always apply essential cookies
    enableEssential();
  }
  
  /**
   * Enable essential cookies/functionality
   */
  function enableEssential() {
    // Essential cookies are always enabled
    // This includes session cookies, CSRF tokens, etc.
    document.body.setAttribute('data-cookies-essential', 'true');
  }
  
  /**
   * Enable analytics tracking
   */
  function enableAnalytics() {
    document.body.setAttribute('data-cookies-analytics', 'true');
    
    // Google Analytics 4 initialization (if implemented later)
    // gtag('consent', 'update', { 'analytics_storage': 'granted' });
    
    // Matomo/Piwik initialization (if implemented later)
  }
  
  /**
   * Disable analytics tracking
   */
  function disableAnalytics() {
    document.body.setAttribute('data-cookies-analytics', 'false');
    
    // Google Analytics 4 denial
    // gtag('consent', 'update', { 'analytics_storage': 'denied' });
  }
  
  /**
   * Enable marketing tracking
   */
  function enableMarketing() {
    document.body.setAttribute('data-cookies-marketing', 'true');
    
    // Facebook Pixel, Google Ads, etc. (if implemented later)
    // gtag('consent', 'update', { 'ad_storage': 'granted', 'ad_user_data': 'granted', 'ad_personalization': 'granted' });
  }
  
  /**
   * Disable marketing tracking
   */
  function disableMarketing() {
    document.body.setAttribute('data-cookies-marketing', 'false');
    
    // gtag('consent', 'update', { 'ad_storage': 'denied', 'ad_user_data': 'denied', 'ad_personalization': 'denied' });
  }
  
  /**
   * Public API for checking consent status
   */
  window.CookieConsent = {
    get: getConsent,
    set: setConsent,
    hasConsent: function(type) {
      const consent = getConsent();
      if (!consent) return false;
      
      if (type === 'essential') return true;
      if (type === 'analytics') return consent.type === CONSENT_STATES.ACCEPTED;
      if (type === 'marketing') return consent.type === CONSENT_STATES.ACCEPTED;
      
      return false;
    },
    revoke: function() {
      try {
        localStorage.removeItem(CONSENT_KEY);
        location.reload();
      } catch (e) {
        console.warn('Could not revoke cookie consent');
      }
    }
  };
  
})();
