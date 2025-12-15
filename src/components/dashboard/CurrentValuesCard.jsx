import { Card } from '../common/Card';
import { CardHeader } from './CardHeader';

/**
 * Card showing current values: Temp, Humidity, Soil moisture, Drip irrigation status
 */
export const CurrentValuesCard = ({ temp, humidity, soilMoisture, dripIrrigationOn }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader title="Current Values" />
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌡️</span>
            <span className="text-sm text-biyokaab-gray">Temp</span>
          </div>
          <span className="text-lg font-bold text-biyokaab-navy">{temp}°F</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">💧</span>
            <span className="text-sm text-biyokaab-gray">Humidity</span>
          </div>
          <span className="text-lg font-bold text-biyokaab-navy">{humidity}%</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌱</span>
            <span className="text-sm text-biyokaab-gray">Soil Moisture</span>
          </div>
          <span className="text-lg font-bold text-biyokaab-navy">{soilMoisture}%</span>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-lg">💧</span>
            <span className="text-sm text-biyokaab-gray">Drip Irrigation</span>
          </div>
          <span className={`text-sm font-semibold px-2 py-1 rounded-full ${dripIrrigationOn ? 'bg-biyokaab-blue bg-opacity-10 text-biyokaab-blue' : 'bg-biyokaab-gray bg-opacity-10 text-biyokaab-gray'}`}>
            {dripIrrigationOn ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>
    </Card>
  );
};


