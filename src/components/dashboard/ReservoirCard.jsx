import { CircularGauge } from '../charts/CircularGauge';
import { Card } from '../common/Card';
import { formatVolume, formatPercent, formatRelativeTime, calculateDaysRemaining } from '../../utils/formatters';

/**
 * Reservoir card with circular gauge and key metrics
 */
export const ReservoirCard = ({ deviceStatus, dailyUsage = 10 }) => {
  if (!deviceStatus) {
    return (
      <Card>
        <div className="text-center text-biyokaab-gray">No device data available</div>
      </Card>
    );
  }

  const { water_volume_l, tank_capacity_l, percent_full, last_update } = deviceStatus;
  const daysRemaining = calculateDaysRemaining(water_volume_l, tank_capacity_l, dailyUsage);

  return (
    <Card className="lg:col-span-2">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
        {/* Gauge */}
        <div className="flex-shrink-0">
          <CircularGauge
            value={percent_full}
            max={100}
            size={200}
            color={percent_full > 50 ? '#4CAF50' : percent_full > 20 ? '#FF9800' : '#E53935'}
            label="Full"
          />
        </div>

        {/* Metrics */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-2xl font-bold text-biyokaab-navy mb-4">Reservoir</h2>
          
          <div className="space-y-3">
            <div>
              <div className="text-4xl font-bold text-biyokaab-blue mb-1">
                {formatVolume(water_volume_l)}
              </div>
              <div className="text-biyokaab-gray">
                of {formatVolume(tank_capacity_l)} ({formatPercent(percent_full)})
              </div>
            </div>

            {daysRemaining !== null && (
              <div className="pt-3 border-t border-gray-100">
                <div className="text-sm text-biyokaab-gray mb-1">Estimated days remaining</div>
                <div className="text-2xl font-semibold text-biyokaab-navy">
                  {daysRemaining} days
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-gray-100">
              <div className="text-sm text-biyokaab-gray">
                Last update: {formatRelativeTime(last_update)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};


