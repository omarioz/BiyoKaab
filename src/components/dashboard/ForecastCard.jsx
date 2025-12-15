import { Card } from '../common/Card';
import { IconRain, IconThermometer } from '../icons';
import { formatTemperature } from '../../utils/formatters';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

/**
 * Weather and rain forecast card
 */
export const ForecastCard = ({ forecast }) => {
  if (!forecast) {
    return (
      <Card>
        <div className="text-center text-biyokaab-gray">No forecast data available</div>
      </Card>
    );
  }

  const { current, forecast: forecastData } = forecast;
  const sparklineData = forecastData.precipitation_7day.map((value, index) => ({
    day: index,
    precipitation: value,
  }));

  return (
    <Card>
      <h3 className="text-lg font-semibold text-biyokaab-navy mb-4">Weather & Forecast</h3>

      {/* Current Weather */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <IconThermometer className="w-5 h-5 text-accent-warning" />
          <div>
            <div className="text-sm text-biyokaab-gray">Temp</div>
            <div className="text-lg font-semibold text-biyokaab-navy">{formatTemperature(current.temperature_c)}</div>
          </div>
        </div>
        <div>
          <div className="text-sm text-biyokaab-gray">Humidity</div>
          <div className="text-lg font-semibold text-biyokaab-navy">{current.humidity_percent.toFixed(0)}%</div>
        </div>
        <div>
          <div className="text-sm text-biyokaab-gray">Wind</div>
          <div className="text-lg font-semibold text-biyokaab-navy">{current.wind_speed_kmh} km/h</div>
        </div>
      </div>

      {/* Rain Forecast */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <IconRain className="w-5 h-5 text-biyokaab-blue" />
            <span className="font-medium text-biyokaab-navy">Next Rain</span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-biyokaab-blue">
              {forecastData.days_until_rain}
            </div>
            <div className="text-sm text-biyokaab-gray">days</div>
          </div>
        </div>
        <div className="text-sm text-biyokaab-gray mb-3">
          {forecastData.rain_probability}% chance
        </div>

        {/* 7-day precipitation sparkline */}
        <div className="h-16">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Tooltip
                formatter={(value) => [`${value} mm`, 'Precipitation']}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '4px 8px' }}
              />
              <Line
                type="monotone"
                dataKey="precipitation"
                stroke="#4A8CF7"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};


