import { Card } from '../components/common/Card';

const historyEvents = [
  {
    title: 'Irrigation cycle completed',
    time: 'Today · 06:30',
    detail: 'Drip system ran for 35 minutes on maize and onions plots.',
    status: 'Success',
  },
  {
    title: 'Water quality check',
    time: 'Yesterday · 18:10',
    detail: 'pH within range. Chlorine filter replaced (1,200 L remaining).',
    status: 'Info',
  },
  {
    title: 'Reservoir refill started',
    time: 'Yesterday · 12:45',
    detail: 'Auto-triggered at 32% capacity; forecast rain in 6 hours.',
    status: 'Auto',
  },
  {
    title: 'Livestock trough alert',
    time: '2 days ago · 17:20',
    detail: 'Level dropped to 22%. Manual top-up performed and sanitized.',
    status: 'Actioned',
  },
];

export const History = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-biyokaab-blue">
          History
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-biyokaab-navy">
          Recent activity & logs
        </h1>
        <p className="text-biyokaab-gray mt-2 max-w-3xl">
          A concise record of recent actions, alerts, and system automations.
        </p>
      </div>

      <Card className="space-y-4">
        {historyEvents.map((event) => (
          <div
            key={event.title + event.time}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-biyokaab-navy">{event.title}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-biyokaab-blue/10 text-biyokaab-blue">
                  {event.status}
                </span>
              </div>
              <p className="text-sm text-biyokaab-gray">{event.detail}</p>
            </div>
            <span className="text-xs text-biyokaab-gray">{event.time}</span>
          </div>
        ))}
      </Card>
    </div>
  );
};






