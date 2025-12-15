import { Card } from '../common/Card';
import { CardHeader } from './CardHeader';

/**
 * Controls card with vertical sliders
 */
export const ControlsCard = ({ controls = [] }) => {
  const defaultControls = [
    { label: 'Water Level', value: 6, min: 0, max: 10 },
    { label: 'Dew Point', value: 36, min: 0, max: 100 },
    { label: 'CO', value: 425, min: 0, max: 1000 },
    { label: 'Max Humidity', value: 75, min: 50, max: 90 },
    { label: 'Max Temp.', value: 92, min: 68, max: 104 },
    { label: 'Sprinkler LvL.', value: 0, min: 0, max: 1 },
    { label: 'Drip LvL.', value: 1, min: 0, max: 5 },
  ];

  const controlsToShow = controls.length > 0 ? controls : defaultControls;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader title="Controls" />
      <div className="flex-1 space-y-4">
        {controlsToShow.map((control, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-biyokaab-navy">{control.label}</label>
                <span className="text-sm font-semibold text-biyokaab-blue">{control.value}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-biyokaab-gray">{control.min}</span>
                <input
                  type="range"
                  min={control.min}
                  max={control.max}
                  value={control.value}
                  className="flex-1 h-2 bg-biyokaab-background rounded-lg appearance-none cursor-pointer accent-biyokaab-blue"
                  readOnly
                />
                <span className="text-xs text-biyokaab-gray">{control.max}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

