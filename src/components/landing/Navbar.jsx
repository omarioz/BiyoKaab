import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * Top navigation bar for BiyoKaab landing page
 */
export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // 1. Listen for the install prompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // 2. Handle the install click
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* LEFT SIDE: Logo */}
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-biyokaab-blue flex items-center justify-center">
              <span className="text-white text-lg sm:text-xl font-bold">b</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-biyokaab-navy">
              <span className="text-biyokaab-blue">B</span>IYOKaab
            </span>
          </Link>

          {/* RIGHT SIDE: Navigation + Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Desktop Navigation Links (Hidden on Mobile) */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link to="/features" className="text-sm lg:text-base text-biyokaab-gray hover:text-biyokaab-navy transition-colors">
                Features
              </Link>
              <Link to="/about" className="text-sm lg:text-base text-biyokaab-gray hover:text-biyokaab-navy transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-sm lg:text-base text-biyokaab-gray hover:text-biyokaab-navy transition-colors">
                Contact
              </Link>
            </div>

            {/* INSTALL APP BUTTON - Visible on Mobile (Icon) and Desktop (Text) */}
            {/* Only shows if browser allows installation */}
            {deferredPrompt && (
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-2 bg-biyokaab-blue/10 text-biyokaab-blue px-3 py-2 sm:px-4 sm:py-2 rounded-full font-medium hover:bg-biyokaab-blue hover:text-white transition-all animate-pulse"
                title="Install App"
              >
                {/* Download Icon */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {/* Text hidden on small mobile, visible on larger screens */}
                <span className="hidden sm:inline text-sm">Install App</span>
              </button>
            )}

            {/* Desktop CTA Button (Hidden on Mobile) */}
            <Link
              to="/dashboard"
              className="hidden md:block bg-biyokaab-blue text-white px-4 lg:px-6 py-2 lg:py-2.5 rounded-full text-sm lg:text-base font-medium hover:bg-opacity-90 transition-all shadow-sm hover:shadow-md"
            >
              Get Started
            </Link>

            {/* Mobile Menu Hamburger (Visible on Mobile) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-biyokaab-navy"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-3">
            <Link
              to="/features"
              className="block text-biyokaab-gray hover:text-biyokaab-navy transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/about"
              className="block text-biyokaab-gray hover:text-biyokaab-navy transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block text-biyokaab-gray hover:text-biyokaab-navy transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/dashboard"
              className="block bg-biyokaab-blue text-white px-6 py-2.5 rounded-full font-medium text-center hover:bg-opacity-90 transition-all mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};