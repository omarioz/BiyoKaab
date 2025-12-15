import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

/**
 * Circular gauge component for reservoir water level
 */
export const CircularGauge = ({
  value,
  max = 100,
  size = 200,
  strokeWidth = 20,
  color = '#1E88E5',
  showLabel = true,
  label,
  className = '',
}) => {
  const percent = Math.min((value / max) * 100, 100);
  const data = [{ value: percent, fill: color }];

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="70%"
          outerRadius="90%"
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            dataKey="value"
            cornerRadius={10}
            fill={color}
            animationDuration={1000}
            animationBegin={0}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold" style={{ color }}>
            {percent.toFixed(1)}%
          </div>
          {label && (
            <div className="text-sm text-biyokaab-gray mt-1">{label}</div>
          )}
        </div>
      )}
    </div>
  );
};


