import GaugeComponent from 'react-gauge-component';

/**
 * Semi-circular gauge component for water tank analytics
 */
export const SemiCircularGauge = ({
  value,
  max = 100,
  size = 250,
  color = '#4A8CF7',
  label,
  unit = '%',
}) => {
  const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  const percent = Math.min((numValue / max) * 100, 100);

  return (
    <div className="relative w-full flex flex-col items-center justify-center" style={{ height: size / 2 + 40, minHeight: size / 2 + 40 }}>
      <div style={{ width: size, height: size / 2 }}>
        <GaugeComponent
          type="semicircle"
          arc={{
            colorArray: [color],
            padding: 0.02,
            subArcs: [
              { limit: max, color: color }
            ],
          }}
          pointer={{
            color: color,
            length: 0.7,
            width: 4,
            elastic: true,
          }}
          labels={{
            valueLabel: {
              style: {
                fontSize: '28px',
                fill: color,
                fontWeight: 'bold',
              },
              formatTextValue: () => `${numValue.toFixed(1)} ${unit}`,
            },
            tickLabels: {
              type: 'outer',
              ticks: [
                { value: 0 },
                { value: max },
              ],
              defaultTickValueConfig: {
                style: {
                  fontSize: '11px',
                  fill: '#64748B',
                  fontWeight: '500',
                },
              },
              defaultTickLineConfig: {
                style: {
                  stroke: '#E2E8F0',
                  strokeWidth: 1,
                },
              },
            },
          }}
          value={percent}
          minValue={0}
          maxValue={max}
        />
      </div>
      {/* Label below gauge */}
      {label && (
        <div className="text-center mt-2">
          <div className="text-sm text-biyokaab-gray font-medium">{label}</div>
        </div>
      )}
    </div>
  );
};

