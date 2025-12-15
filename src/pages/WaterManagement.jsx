import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

const cropPlans = [
  {
    name: 'Tomatoes',
    schedule: '2x per day (dawn & dusk)',
    detail: 'Target 6-8 L per plant, keep soil evenly moist.',
    alerts: 'Pause when soil moisture > 70% or heavy rain forecasted.',
  },
  {
    name: 'Maize',
    schedule: '1x per day',
    detail: '12-15 L per plant, focus on early morning to reduce loss.',
    alerts: 'Skip if wind > 30 km/h to reduce evaporation.',
  },
  {
    name: 'Onions',
    schedule: '3x per week',
    detail: '4-5 L per plant, avoid standing water to prevent rot.',
    alerts: 'Use drip only; stop when soil moisture > 60%.',
  },
];

const planCards = [
  {
    title: 'Drinking Water for People',
    icon: '🚰',
    volume: '1,200 L / day',
    description:
      'Safe, continuous supply for household and crew. Prioritize filtration and balanced storage.',
    steps: [
      'Morning: flush lines, test chlorine/filters',
      'Midday: top-up storage tank, keep ≥ 40% reserve',
      'Evening: distribute to living quarters & kitchens',
    ],
  },
  {
    title: 'Livestock',
    icon: '🐄',
    volume: '900 L / day',
    description:
      'Steady access for cattle, goats, and poultry with surge capacity during hotter hours.',
    steps: [
      '05:30: fill troughs to 80% to reduce daytime refills',
      '12:00: quick top-up; trigger misting if temp > 32°C',
      '18:00: sanitize trough edges; check auto-float valves',
    ],
  },
];

export const WaterManagement = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-biyokaab-blue">
            Water Management
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-biyokaab-navy">
            Efficient water use plan
          </h1>
          <p className="text-biyokaab-gray mt-2 max-w-3xl">
            Balanced supply for people, livestock, and crops with actionable schedules that
            can adapt to weather and sensor data.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            Download plan
          </Button>
          <Button size="sm">
            Optimize with AI
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {planCards.map((plan) => (
          <Card key={plan.title} className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{plan.icon}</span>
                <div>
                  <h2 className="text-lg font-semibold text-biyokaab-navy">{plan.title}</h2>
                  <p className="text-sm text-biyokaab-gray">{plan.description}</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-biyokaab-blue bg-biyokaab-blue/10 px-3 py-1 rounded-full">
                {plan.volume}
              </span>
            </div>
            <ul className="list-disc list-inside text-sm text-biyokaab-gray space-y-1">
              {plan.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
            <div className="flex gap-2 pt-2">
              <Button variant="secondary" size="sm" className="w-full">
                View timeline
              </Button>
              <Button size="sm" className="w-full">
                Auto-adjust
              </Button>
            </div>
          </Card>
        ))}

        <Card className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌾</span>
              <div>
                <h2 className="text-lg font-semibold text-biyokaab-navy">Crops</h2>
                <p className="text-sm text-biyokaab-gray">
                  Targeted irrigation by crop type with soil moisture and weather safeguards.
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-biyokaab-blue bg-biyokaab-blue/10 px-3 py-1 rounded-full">
              Tomatoes · Maize · Onions
            </span>
          </div>
          <div className="space-y-3">
            {cropPlans.map((crop) => (
              <div
                key={crop.name}
                className="border border-gray-100 rounded-xl p-3 bg-biyokaab-background/60"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-biyokaab-navy">{crop.name}</h3>
                  <span className="text-xs text-biyokaab-blue font-medium">
                    {crop.schedule}
                  </span>
                </div>
                <p className="text-sm text-biyokaab-gray mt-1">{crop.detail}</p>
                <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-2 py-1 mt-2">
                  {crop.alerts}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm">
              Rainfall offsets
            </Button>
            <Button size="sm">Sync to valves</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};


