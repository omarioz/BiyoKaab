import { useEffect, useState } from 'react';
import { useDeviceStore } from '../store/deviceStore';
import { useUIStore } from '../store/uiStore';
import { WaterTankCard } from '../components/dashboard/WaterTankCard';
import { LocationMap } from '../components/dashboard/LocationMap';
import { CurrentValuesCard } from '../components/dashboard/CurrentValuesCard';
import { MonthlyTrendsChart } from '../components/dashboard/MonthlyTrendsChart';
import { ToggleCard } from '../components/dashboard/ToggleCard';
import { EmptyState } from '../components/common/EmptyState';

/**
 * Main Dashboard page
 */
export const Dashboard = () => {
  const {
    currentDeviceId,
    deviceStatus,
    timeSeriesData,
    schedules,
    recommendations,
    forecast,
    dateRange,
    fetchTimeSeries,
    fetchDeviceStatus,
    setDateRange,
  } = useDeviceStore();

  const { sidebarCollapsed } = useUIStore();
  const [dripIrrigationOn, setDripIrrigationOn] = useState(true);
  const [animalWateringOn, setAnimalWateringOn] = useState(false);
  
  // Mock soil moisture data
  const soilMoisture = 52;

  useEffect(() => {
    if (currentDeviceId && dateRange) {
      fetchTimeSeries(currentDeviceId, dateRange);
    }
  }, [currentDeviceId, dateRange, fetchTimeSeries]);

  // Auto-refresh device status every 5 seconds to see distance_cm updates
  useEffect(() => {
    if (currentDeviceId) {
      // Fetch immediately
      fetchDeviceStatus(currentDeviceId);
      
      // Then refresh every 5 seconds
      const interval = setInterval(() => {
        fetchDeviceStatus(currentDeviceId);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [currentDeviceId, fetchDeviceStatus]);

  if (!deviceStatus) {
    return (
      <div className="p-6 sm:p-8 bg-biyokaab-background min-h-screen">
        <EmptyState
          title="No Device Selected"
          message="Please select a device from the top navigation to view dashboard data."
        />
      </div>
    );
  }

  // Convert Celsius to Fahrenheit for display
  const currentTempC = forecast?.current?.temperature_c || 29;
  const currentTempF = Math.round((currentTempC * 9/5) + 32);
  const currentHumidity = forecast?.current?.humidity_percent || 62;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-biyokaab-background min-h-screen">
      {/* Main Title */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-biyokaab-navy">
          Cropfield Water Tank
        </h1>
      </div>

      {/* Main Grid Layout - 3 rows as specified */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Row 1: Water Tank 01, Location, Current Values */}
        <div className="md:col-span-1">
          <WaterTankCard deviceStatus={deviceStatus} />
        </div>
        <div className="md:col-span-1">
          <LocationMap />
        </div>
        <div className="md:col-span-1">
          <CurrentValuesCard
            temp={currentTempF}
            humidity={currentHumidity}
            soilMoisture={soilMoisture}
            dripIrrigationOn={dripIrrigationOn}
          />
        </div>

        {/* Row 2: Monthly Trends Chart (full width) */}
        <div className="md:col-span-2 lg:col-span-3">
          <MonthlyTrendsChart data={timeSeriesData} />
        </div>

        {/* Row 3: Drip Irrigation and Animal Watering toggles */}
        <div className="md:col-span-1">
          <ToggleCard
            title="Drip Irrigation"
            isOn={dripIrrigationOn}
            onToggle={() => setDripIrrigationOn(!dripIrrigationOn)}
            icon="💧"
          />
        </div>
        <div className="md:col-span-1">
          <ToggleCard
            title="Animal Watering"
            isOn={animalWateringOn}
            onToggle={() => setAnimalWateringOn(!animalWateringOn)}
            icon="🐄"
          />
        </div>
      </div>
    </div>
  );
};


