import { Card } from '../common/Card';
import { CardHeader } from './CardHeader';
import { SemiCircularGauge } from '../charts/SemiCircularGauge';
import { formatVolume } from '../../utils/formatters';

/**
 * Water Tank card with semi-circular gauge
 */
export const WaterTankCard = ({ deviceStatus }) => {
  if (!deviceStatus) {
    return (
      <Card>
        <div className="text-center text-biyokaab-gray">No device data available</div>
      </Card>
    );
  }

  const { water_volume_l, tank_capacity_l, percent_full, distance_cm } = deviceStatus;

  // Debug: Log distance_cm to console
  console.log('WaterTankCard - distance_cm:', distance_cm, 'deviceStatus:', deviceStatus);

  // Determine status label based on percentage
  const getStatusLabel = (percent) => {
    if (percent >= 90) return 'Full';
    if (percent >= 75) return 'Good';
    if (percent >= 50) return 'Moderate';
    if (percent >= 25) return 'Low';
    if (percent > 0) return 'Very Low';
    return 'Empty';
  };

  const statusLabel = getStatusLabel(percent_full);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader title="Water Tank 01" />
      <div className="flex-1 flex flex-col items-center justify-center py-2 lg:py-3">
        <SemiCircularGauge
          value={percent_full}
          max={100}
          size={250}
          color="#4A8CF7"
          label={statusLabel}
          unit="%"
        />
        <div className="mt-3 text-center border-t border-gray-100 pt-3 w-full">
          <div className="text-sm lg:text-base font-medium text-biyokaab-gray">
            {formatVolume(water_volume_l)} / {formatVolume(tank_capacity_l)}
          </div>
        </div>
      </div>
      {/* Display distance_cm at the bottom of the card - always visible for testing */}
      <div className="border-t border-gray-100 pt-2 pb-2 mt-auto">
        <div className="text-xs lg:text-sm font-semibold text-biyokaab-navy text-center">
          Distance: {distance_cm !== null && distance_cm !== undefined 
            ? `${distance_cm.toFixed(1)} cm` 
            : 'N/A'}
        </div>
      </div>
    </Card>
  );
};

