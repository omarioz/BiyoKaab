import { Card } from '../common/Card';
import { CardHeader } from './CardHeader';

/**
 * Toggle switch card component
 */
export const ToggleCard = ({ title, isOn, onToggle, icon }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader title={title} />
      <div className="flex items-center justify-center py-3">
        <button
          onClick={onToggle}
          className={`
            relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-biyokaab-blue focus:ring-offset-2
            ${isOn ? 'bg-biyokaab-blue' : 'bg-biyokaab-gray'}
          `}
        >
          <span
            className={`
              inline-block h-6 w-6 transform rounded-full bg-white transition-transform
              ${isOn ? 'translate-x-9' : 'translate-x-1'}
            `}
          />
        </button>
      </div>
      {icon && (
        <div className="flex justify-center mt-2 text-2xl">{icon}</div>
      )}
    </Card>
  );
};

