import { Card } from '../common/Card';
import { CardHeader } from './CardHeader';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

/**
 * Temperature & Humidity line chart card
 */
export const TemperatureHumidityChart = ({ data }) => {
  // Transform time series data or use mock data
  let chartData = [];
  if (data && data.temp) {
    chartData = data.temp.slice(0, 20).map((point, i) => ({
      time: `${12 + Math.floor(i / 3)}:${String((i % 3) * 20).padStart(2, '0')}`,
      temperature: point[1] || 60 + Math.random() * 20,
    }));
  } else {
    chartData = Array.from({ length: 20 }, (_, i) => ({
      time: `${12 + Math.floor(i / 3)}:${String((i % 3) * 20).padStart(2, '0')}`,
      temperature: 60 + Math.random() * 20,
    }));
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader title="Temperature & Humidity" />
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis
              dataKey="time"
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
              domain={[0, 80]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '4px 8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#4A8CF7"
              strokeWidth={2}
              dot={false}
              name="Temperature"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

