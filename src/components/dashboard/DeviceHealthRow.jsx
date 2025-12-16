import { Card } from '../common/Card';
import { IconBattery, IconSignal } from '../icons';
import { formatRelativeTime } from '../../utils/formatters';

/**
 * Device health information row
 */
export const DeviceHealthRow = ({ deviceHealth, lastUpdate }) => {
  if (!deviceHealth) {
    return (
      <Card>
        <div className="text-center text-neutral-500">No health data available</div>
      </Card>
    );
  }

  const { battery_percent, signal_strength, firmware_version, last_ping } = deviceHealth;

  // Convert signal strength to bars (0-4)
  const signalBars = signal_strength > -50 ? 4 : signal_strength > -60 ? 3 : signal_strength > -70 ? 2 : 1;

  return (
    <Card>
      <h3 className="text-lg font-semibold text-neutral-800 mb-4">Device Health</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <IconBattery className="w-5 h-5 text-neutral-600" percent={battery_percent} />
            <span className="text-sm text-neutral-600">Battery</span>
          </div>
          <div className="text-xl font-semibold">{battery_percent}%</div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <IconSignal className="w-5 h-5 text-neutral-600" strength={signalBars} />
            <span className="text-sm text-neutral-600">Signal</span>
          </div>
          <div className="text-xl font-semibold">{signal_strength} dBm</div>
        </div>

        <div>
          <div className="text-sm text-neutral-600 mb-2">Firmware</div>
          <div className="text-xl font-semibold">v{firmware_version}</div>
        </div>

        <div>
          <div className="text-sm text-neutral-600 mb-2">Last Ping</div>
          <div className="text-sm font-semibold">{formatRelativeTime(last_ping || lastUpdate)}</div>
        </div>
      </div>
    </Card>
  );
};







