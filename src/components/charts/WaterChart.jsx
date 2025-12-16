import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

/**
 * Multi-series time series chart for water level, humidity, temperature, and rain
 */
export const WaterChart = ({
  data,
  dateRange = '7d',
  onRangeChange,
  className = '',
}) => {
  const [selectedSeries, setSelectedSeries] = useState({
    water_volume: true,
    humidity: true,
    temp: true,
    rain: false,
  });

  if (!data || !data.water_volume) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <p className="text-neutral-500">No data available</p>
      </div>
    );
  }

  // Transform data for Recharts
  const chartData = [];
  const maxLength = Math.max(
    data.water_volume?.length || 0,
    data.humidity?.length || 0,
    data.temp?.length || 0,
    data.rain?.length || 0
  );

  for (let i = 0; i < maxLength; i++) {
    const point = {
      timestamp: data.water_volume?.[i]?.[0] || data.humidity?.[i]?.[0] || data.temp?.[i]?.[0] || data.rain?.[i]?.[0],
    };
    if (data.water_volume?.[i]) point.water_volume = data.water_volume[i][1];
    if (data.humidity?.[i]) point.humidity = data.humidity[i][1];
    if (data.temp?.[i]) point.temp = data.temp[i][1];
    if (data.rain?.[i]) point.rain = data.rain[i][1];
    chartData.push(point);
  }

  const formatXAxis = (tickItem) => {
    return format(new Date(tickItem), dateRange === '24h' ? 'HH:mm' : 'MMM d');
  };

  const formatTooltip = (value, name) => {
    if (name === 'water_volume') return [`${value.toFixed(1)} L`, 'Water Level'];
    if (name === 'humidity') return [`${value.toFixed(1)}%`, 'Humidity'];
    if (name === 'temp') return [`${value.toFixed(1)}°C`, 'Temperature'];
    if (name === 'rain') return [`${value.toFixed(1)} mm`, 'Rain'];
    return [value, name];
  };

  return (
    <div className={className}>
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
        <div className="flex flex-wrap gap-2">
          {Object.entries(selectedSeries).map(([key, visible]) => (
            <button
              key={key}
              onClick={() => setSelectedSeries({ ...selectedSeries, [key]: !visible })}
              className={`
                px-3 py-1 rounded-lg text-sm font-medium transition-colors
                ${visible
                  ? 'bg-primary-blue text-white'
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                }
              `}
            >
              {key === 'water_volume' ? 'Water Level' :
               key === 'humidity' ? 'Humidity' :
               key === 'temp' ? 'Temperature' :
               'Rain'}
            </button>
          ))}
        </div>

        {onRangeChange && (
          <div className="flex gap-2">
            {['24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => onRangeChange(range)}
                className={`
                  px-3 py-1 rounded-lg text-sm font-medium transition-colors
                  ${dateRange === range
                    ? 'bg-primary-blue text-white'
                    : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                  }
                `}
              >
                {range}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatXAxis}
            stroke="#718096"
            style={{ fontSize: '12px' }}
          />
          <YAxis yAxisId="left" stroke="#718096" style={{ fontSize: '12px' }} />
          <YAxis yAxisId="right" orientation="right" stroke="#718096" style={{ fontSize: '12px' }} />
          <Tooltip
            formatter={formatTooltip}
            labelFormatter={(label) => format(new Date(label), 'PPp')}
            contentStyle={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '8px' }}
          />
          <Legend />
          {selectedSeries.water_volume && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="water_volume"
              stroke="#1E88E5"
              strokeWidth={2}
              dot={false}
              name="Water Level (L)"
              animationDuration={500}
            />
          )}
          {selectedSeries.humidity && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="humidity"
              stroke="#009688"
              strokeWidth={2}
              dot={false}
              name="Humidity (%)"
              animationDuration={500}
            />
          )}
          {selectedSeries.temp && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="temp"
              stroke="#FF9800"
              strokeWidth={2}
              dot={false}
              name="Temperature (°C)"
              animationDuration={500}
            />
          )}
          {selectedSeries.rain && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="rain"
              stroke="#4CAF50"
              strokeWidth={2}
              dot={false}
              name="Rain (mm)"
              animationDuration={500}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};







