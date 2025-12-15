import { Card } from '../common/Card';
import { CardHeader } from './CardHeader';

/**
 * Location map component
 */
export const LocationMap = () => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader title="Location" />
      <div className="relative flex-1 min-h-[150px] bg-biyokaab-background rounded-xl overflow-hidden">
        {/* Simple map representation */}
        <svg
          viewBox="0 0 200 150"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background */}
          <rect width="200" height="150" fill="#F4F7FC" />
          
          {/* Streets */}
          <line x1="0" y1="75" x2="200" y2="75" stroke="#CBD5E0" strokeWidth="2" />
          <line x1="100" y1="0" x2="100" y2="150" stroke="#CBD5E0" strokeWidth="2" />
          <line x1="50" y1="0" x2="50" y2="75" stroke="#CBD5E0" strokeWidth="1.5" />
          <line x1="150" y1="75" x2="150" y2="150" stroke="#CBD5E0" strokeWidth="1.5" />
          
          {/* Location pin */}
          <circle cx="100" cy="75" r="8" fill="#4A8CF7" />
          <circle cx="100" cy="75" r="4" fill="white" />
          <path
            d="M100 83 L96 75 L104 75 Z"
            fill="#4A8CF7"
          />
        </svg>
      </div>
    </Card>
  );
};

