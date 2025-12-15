/**
 * Floating feature card component for hero section
 */
export const FeatureCard = ({ icon, title, value, unit, position = 'default' }) => {
  const positionClasses = {
    topLeft: 'top-4 left-4 md:top-10 md:left-10',
    topRight: 'top-4 right-4 md:top-10 md:right-10',
    bottomLeft: 'bottom-4 left-4 md:bottom-10 md:left-10',
    bottomRight: 'bottom-4 right-4 md:bottom-10 md:right-10',
    default: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  };

  return (
    <div
      className={`
        absolute ${positionClasses[position]}
        bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all
        border border-gray-100
        backdrop-blur-sm
        hidden sm:block
      `}
    >
      <div className="flex items-center gap-2 md:gap-3 mb-2">
        <div className="text-xl md:text-2xl">{icon}</div>
        <h3 className="text-xs md:text-sm font-semibold text-biyokaab-gray">{title}</h3>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl md:text-2xl font-bold text-biyokaab-navy">{value}</span>
        <span className="text-xs md:text-sm text-biyokaab-gray">{unit}</span>
      </div>
    </div>
  );
};

