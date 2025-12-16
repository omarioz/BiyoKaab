import { Card } from '../common/Card';
import { CardHeader } from './CardHeader';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

/**
 * Monthly trends chart showing Temp, Humidity, Soil Moisture, and Drip Irrigation over August 2025
 */
export const MonthlyTrendsChart = ({ data }) => {
  // Generate mock data for August 2025 if none provided
  const chartData = data || Array.from({ length: 31 }, (_, i) => ({
    date: `${i + 1}`,
    temp: 75 + Math.sin(i / 5) * 10 + Math.random() * 5,
    humidity: 60 + Math.cos(i / 4) * 15 + Math.random() * 5,
    soilMoisture: 45 + Math.sin(i / 6) * 20 + Math.random() * 5,
    dripIrrigation: i % 3 === 0 ? 1 : 0, // On every 3rd day
  }));

  return (
    <Card className="h-full flex flex-col">
      <CardHeader title="Monthly Trends - August 2025" />
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <XAxis 
              dataKey="date" 
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
            />
            <YAxis 
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '4px 8px',
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#4A8CF7"
              strokeWidth={2}
              dot={false}
              name="Temperature (°F)"
            />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
              name="Humidity (%)"
            />
            <Line
              type="monotone"
              dataKey="soilMoisture"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={false}
              name="Soil Moisture (%)"
            />
            <Line
              type="monotone"
              dataKey="dripIrrigation"
              stroke="#EF4444"
              strokeWidth={2}
              dot={false}
              name="Drip Irrigation"
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};






