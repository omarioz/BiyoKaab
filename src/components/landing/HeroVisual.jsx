import { FeatureCard } from './FeatureCard';

/**
 * Central visual component for hero section with floating feature cards
 */
export const HeroVisual = () => {
  return (
    <div className="relative max-w-4xl mx-auto mt-8 sm:mt-12 lg:mt-16 mb-12 sm:mb-16 lg:mb-20 px-4">
      {/* Main Device Illustration Container */}
      <div className="relative bg-gradient-to-br from-biyokaab-blue/10 to-biyokaab-blue/5 rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 lg:p-20 min-h-[250px] sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px] flex items-center justify-center">
        {/* Water Drop Icon - Main Visual */}
        <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-52 xl:h-52">
          <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-biyokaab-blue w-full h-full"
          >
            {/* Water Drop Shape */}
            <path
              d="M100 40C100 40 60 80 60 120C60 150 80 170 100 170C120 170 140 150 140 120C140 80 100 40 100 40Z"
              fill="currentColor"
              fillOpacity="0.2"
            />
            <path
              d="M100 40C100 40 60 80 60 120C60 150 80 170 100 170C120 170 140 150 140 120C140 80 100 40 100 40Z"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Highlight */}
            <ellipse cx="90" cy="90" rx="15" ry="20" fill="white" fillOpacity="0.3" />
            {/* IoT Connection Dots */}
            <circle cx="60" cy="60" r="4" fill="currentColor" />
            <circle cx="140" cy="60" r="4" fill="currentColor" />
            <circle cx="100" cy="30" r="4" fill="currentColor" />
            {/* Connection Lines */}
            <line x1="100" y1="30" x2="100" y2="40" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="60" y1="60" x2="80" y2="80" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="140" y1="60" x2="120" y2="80" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* Floating Feature Cards */}
        <FeatureCard
          icon="💧"
          title="Water Level"
          value="85"
          unit="%"
          position="topLeft"
        />
        <FeatureCard
          icon="🌫️"
          title="Fog Capture"
          value="12.5"
          unit="L/day"
          position="topRight"
        />
        <FeatureCard
          icon="🤖"
          title="AI Insights"
          value="24/7"
          unit="monitoring"
          position="bottomLeft"
        />
      </div>
    </div>
  );
};

