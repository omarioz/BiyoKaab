import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { HeroVisual } from '../components/landing/HeroVisual';
import { FeaturesSection } from '../components/landing/FeaturesSection';

/**
 * Landing page for BiyoKaab
 */
export const Landing = () => {
  return (
    <div className="min-h-screen bg-biyokaab-background">
      <Navbar />
      <Hero />
      <HeroVisual />
      <FeaturesSection />
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-biyokaab-blue flex items-center justify-center">
              <span className="text-white text-base sm:text-lg font-bold">b</span>
            </div>
            <span className="text-base sm:text-lg font-bold text-biyokaab-navy">
              <span className="text-biyokaab-blue">B</span>IYOKaab
            </span>
          </div>
          <p className="text-sm sm:text-base text-biyokaab-gray">
            © 2025 BiyoKaab. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

