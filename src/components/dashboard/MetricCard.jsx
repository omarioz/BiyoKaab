import { Card } from '../common/Card';

/**
 * Small metric card showing last value and timestamp
 */
export const MetricCard = ({ title, value, unit, timeAgo, icon }) => {
  return (
    <Card className="h-full flex flex-col">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-medium text-biyokaab-gray">{title}</h4>
        {icon && <div className="text-xl">{icon}</div>}
      </div>
      <div className="mb-1">
        <div className="text-sm text-biyokaab-gray mb-1">Last value:</div>
        <div className="text-2xl font-bold text-biyokaab-blue">
          {value}
          {unit && <span className="text-xl ml-1">{unit}</span>}
        </div>
      </div>
      <div className="text-xs text-biyokaab-gray">{timeAgo}</div>
    </Card>
  );
};

