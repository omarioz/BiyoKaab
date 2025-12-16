import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useUIStore } from '../../store/uiStore';

/**
 * AI Recommendations card with prioritized list
 */
export const AIRecommendationList = ({ recommendations = [] }) => {
  const { addToast } = useUIStore();

  const confidenceColors = {
    high: 'bg-primary-green',
    medium: 'bg-accent-warning',
    low: 'bg-neutral-400',
  };

  const handleApply = (recommendation) => {
    addToast({
      variant: 'success',
      title: 'Recommendation Applied',
      message: recommendation.title,
    });
  };

  if (recommendations.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">AI Recommendations</h3>
        <div className="text-center text-neutral-500 py-4">
          No recommendations at this time
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-neutral-800 mb-4">AI Recommendations</h3>
      
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-4 bg-neutral-50 rounded-lg border border-neutral-200"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-neutral-800">{rec.title}</h4>
                  <span
                    className={`
                      px-2 py-0.5 rounded text-xs font-medium text-white
                      ${confidenceColors[rec.confidence] || confidenceColors.low}
                    `}
                  >
                    {rec.confidence}
                  </span>
                </div>
                <p className="text-sm text-neutral-600">{rec.description}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleApply(rec)}
              >
                Apply
              </Button>
              <Button
                variant="secondary"
                size="sm"
              >
                Dismiss
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};







