import { Link } from 'react-router-dom';

/**
 * Hero section for BiyoKaab landing page
 */
export const Hero = () => {
  return (
    <section className="pt-20 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-biyokaab-navy mb-4 sm:mb-6 leading-tight px-2">
            <span className="block sm:inline">Harvest Water from</span>{' '}
            <span className="inline-block bg-biyokaab-blue/10 text-biyokaab-blue px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 md:py-2.5 lg:py-3 rounded-full text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl my-1 sm:my-0 font-bold">
              Fog
            </span>
            {' '}<span className="block sm:inline">and Manage It</span>{' '}
            <span className="inline-block bg-biyokaab-blue/10 text-biyokaab-blue px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 md:py-2.5 lg:py-3 rounded-full text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl my-1 sm:my-0 font-bold">
              Intelligently
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-biyokaab-gray mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
            BiyoKaab is a cutting-edge platform for fog water harvesting and intelligent water management. 
            Monitor, optimize, and conserve water resources with AI-powered insights.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Link
              to="/dashboard"
              className="bg-biyokaab-blue text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl w-full sm:w-auto text-center"
            >
              Start Monitoring
            </Link>
            <Link
              to="/learn-more"
              className="bg-white text-biyokaab-blue px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg border-2 border-biyokaab-blue hover:bg-biyokaab-blue/5 transition-all w-full sm:w-auto text-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

