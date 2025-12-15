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

  const { water_volume_l, tank_capacity_l, percent_full } = deviceStatus;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader title="Water Tank 01" />
      <div className="flex-1 flex flex-col items-center justify-center py-2 lg:py-3">
        <SemiCircularGauge
          value={percent_full}
          max={100}
          size={250}
          color="#4A8CF7"
          label="Full"
          unit="%"
        />
        <div className="mt-3 text-center border-t border-gray-100 pt-3 w-full">
          <div className="text-sm lg:text-base font-medium text-biyokaab-gray">
            {formatVolume(water_volume_l)} / {formatVolume(tank_capacity_l)}
          </div>
        </div>
      </div>
    </Card>
  );
};

