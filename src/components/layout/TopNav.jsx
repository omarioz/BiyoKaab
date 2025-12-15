import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useDeviceStore } from '../../store/deviceStore';
import { Dropdown } from '../common/Dropdown';
import { Button } from '../common/Button';
import { useUIStore } from '../../store/uiStore';

/**
 * Top navigation bar with device selector, user avatar, and quick actions
 */
export const TopNav = () => {
  const { devices, currentDeviceId, fetchDevices, setCurrentDevice } = useDeviceStore();
  const { openModal, addToast } = useUIStore();
  const [notifications, setNotifications] = useState(3);
  const [currentTime, setCurrentTime] = useState(new Date());

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/water-management', label: 'Water Management' },
    { to: '/ai', label: 'AI' },
    { to: '/history', label: 'History' },
    { to: '/settings', label: 'Settings' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const deviceOptions = devices.map(device => ({
    value: device.id,
    label: `${device.name} (${device.id})`,
  }));

  const handleDeviceChange = (deviceId) => {
    setCurrentDevice(deviceId);
    addToast({
      variant: 'info',
      message: `Switched to ${devices.find(d => d.id === deviceId)?.name}`,
    });
  };

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 py-3 fixed top-0 left-0 right-0 z-40">
      <div className="flex items-center justify-between">
        {/* Left: Logo/Name */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-biyokaab-blue flex items-center justify-center">
              <span className="text-white text-lg sm:text-xl font-bold">b</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-biyokaab-navy hidden sm:inline">
              <span className="text-biyokaab-blue">B</span>IYOKaab
            </span>
          </Link>
        </div>

        {/* Center: Navigation Links and Device Selector */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 flex-1 justify-center">
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm lg:text-base text-biyokaab-gray hover:text-biyokaab-navy transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div className="max-w-xs">
            <Dropdown
              options={deviceOptions}
              value={currentDeviceId}
              onChange={handleDeviceChange}
              placeholder="Select device..."
            />
          </div>
        </div>

        {/* Right: Date/Time and Actions */}
        <div className="flex items-center gap-4">
          {/* Date and Time */}
          <div className="hidden lg:flex flex-col items-end">
            <div className="text-sm font-medium text-biyokaab-navy">
              {format(currentTime, 'd MMM, yyyy')}
            </div>
            <div className="text-xs text-biyokaab-gray">
              {format(currentTime, 'h:mm a')}
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <button
              className="p-2 text-biyokaab-gray hover:text-biyokaab-navy transition-colors rounded-lg hover:bg-biyokaab-background"
              aria-label="Grid view"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              className="p-2 text-biyokaab-gray hover:text-biyokaab-navy transition-colors rounded-lg hover:bg-biyokaab-background"
              aria-label="Back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <button
              className="p-2 text-biyokaab-gray hover:text-biyokaab-navy transition-colors rounded-lg hover:bg-biyokaab-background"
              aria-label="Lock"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => openModal('addDevice')}
          >
            Add Device
          </Button>

            <button
              className="relative p-2 text-biyokaab-gray hover:text-biyokaab-navy transition-colors rounded-lg hover:bg-biyokaab-background"
              onClick={() => openModal('notifications')}
              aria-label="Notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-accent-danger text-white text-xs rounded-full flex items-center justify-center text-[10px]">
                  {notifications}
                </span>
              )}
            </button>
            <button
              className="w-8 h-8 rounded-full bg-biyokaab-blue text-white flex items-center justify-center font-semibold hover:bg-opacity-90 transition-colors text-sm"
              aria-label="User menu"
            >
              U
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};


