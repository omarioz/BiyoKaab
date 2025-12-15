import { useState } from 'react';
import { Card } from '../components/common/Card';
import { Toggle } from '../components/common/Toggle';
import { Button } from '../components/common/Button';

export const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [emailSummary, setEmailSummary] = useState(false);
  const [autoAdjust, setAutoAdjust] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-biyokaab-blue">
            Settings
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-biyokaab-navy">
            Default preferences
          </h1>
          <p className="text-biyokaab-gray mt-2 max-w-3xl">
            Configure notifications, automation defaults, and display options.
          </p>
        </div>
        <Button variant="secondary" size="sm">
          Restore defaults
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="space-y-4">
          <h2 className="font-semibold text-biyokaab-navy">Notifications</h2>
          <div className="space-y-3">
            <Toggle
              checked={notifications}
              onChange={() => setNotifications((v) => !v)}
              label="Push notifications for alerts and system updates"
            />
            <Toggle
              checked={emailSummary}
              onChange={() => setEmailSummary((v) => !v)}
              label="Email daily summary"
            />
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="font-semibold text-biyokaab-navy">Automation</h2>
          <div className="space-y-3">
            <Toggle
              checked={autoAdjust}
              onChange={() => setAutoAdjust((v) => !v)}
              label="Allow auto-adjustments from AI recommendations"
            />
            <Toggle
              checked={darkMode}
              onChange={() => setDarkMode((v) => !v)}
              label="Dark mode preview"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="w-full">
              Save changes
            </Button>
            <Button size="sm" className="w-full">
              Apply now
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};


