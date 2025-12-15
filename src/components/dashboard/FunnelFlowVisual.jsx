import { Card } from '../common/Card';
import { IconFunnel, IconWaterDrop } from '../icons';

/**
 * Funnel flow visual diagram (mesh → funnel → tank)
 */
export const FunnelFlowVisual = ({ isActive = false }) => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-biyokaab-navy mb-4">Collection Flow</h3>
      
      <div className="flex items-center justify-center gap-4 py-6">
        {/* Mesh */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-biyokaab-background rounded-xl flex items-center justify-center mb-2">
            <svg className="w-10 h-10 text-biyokaab-gray" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 2a2 2 0 012-2h12a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V2zm3 1h10v2H5V3zm0 4h10v2H5V7zm0 4h10v2H5v-2zm0 4h10v2H5v-2z" />
            </svg>
          </div>
          <span className="text-sm text-biyokaab-gray">Mesh</span>
        </div>

        {/* Arrow */}
        <div className="text-biyokaab-gray">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>

        {/* Funnel */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-biyokaab-blue bg-opacity-10 rounded-xl flex items-center justify-center mb-2">
            <IconFunnel className="w-10 h-10 text-biyokaab-blue" />
          </div>
          <span className="text-sm text-biyokaab-gray">Funnel</span>
        </div>

        {/* Arrow */}
        <div className="text-biyokaab-gray">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>

        {/* Tank */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-biyokaab-blue bg-opacity-10 rounded-xl flex items-center justify-center mb-2 relative">
            <IconWaterDrop className="w-10 h-10 text-biyokaab-blue" />
            {isActive && (
              <div className="absolute -top-2 -right-2 animate-bounce">
                <IconWaterDrop className="w-6 h-6 text-biyokaab-blue opacity-75" />
              </div>
            )}
          </div>
          <span className="text-sm text-biyokaab-gray">Tank</span>
        </div>
      </div>

      {isActive && (
        <div className="text-center text-sm text-biyokaab-blue font-medium mt-2">
          Active collection
        </div>
      )}
    </Card>
  );
};


