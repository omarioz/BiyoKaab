/**
 * Features section component
 */
export const FeaturesSection = () => {
  const features = [
    {
      icon: '🌫️',
      title: 'Fog Water Harvesting',
      description: 'Advanced fog collection systems that maximize water capture from atmospheric moisture.',
    },
    {
      icon: '📊',
      title: 'Real-Time Monitoring',
      description: 'Track water levels, quality, and system performance with live IoT sensors and dashboards.',
    },
    {
      icon: '🤖',
      title: 'AI-Powered Insights',
      description: 'Get intelligent recommendations for optimal water usage and conservation strategies.',
    },
    {
      icon: '💧',
      title: 'Smart Management',
      description: 'Automated scheduling and distribution systems for efficient water resource management.',
    },
    {
      icon: '📱',
      title: 'Mobile Access',
      description: 'Monitor and control your water systems from anywhere with our responsive platform.',
    },
    {
      icon: '🌍',
      title: 'Sustainability',
      description: 'Contribute to water conservation and environmental sustainability with data-driven decisions.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-biyokaab-navy mb-3 sm:mb-4 px-2">
            Powerful Features for Water Management
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-biyokaab-gray max-w-2xl mx-auto px-4">
            Everything you need to harvest, monitor, and manage water resources efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all border border-gray-100"
            >
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{feature.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold text-biyokaab-navy mb-2 sm:mb-3">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-biyokaab-gray leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

