import { Link, useLocation } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';

/**
 * Sidebar navigation for desktop
 */
export const SideNav = () => {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/water-management', label: 'Water Management', icon: '💧' },
    { path: '/ai', label: 'AI', icon: '🤖' },
    { path: '/history', label: 'History', icon: '📜' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside
      className={`
        bg-white border-r border-gray-100 h-screen fixed left-0 top-0
        transition-all duration-300 z-30
        ${sidebarCollapsed ? 'w-16' : 'w-64'}
        hidden lg:block
      `}
    >
      <div className="flex flex-col h-full">
        {/* Toggle button */}
        <div className="p-4 border-b border-gray-100">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-end text-biyokaab-gray hover:text-biyokaab-navy transition-colors"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={sidebarCollapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'}
              />
            </svg>
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                      ${isActive
                        ? 'bg-biyokaab-blue bg-opacity-10 text-biyokaab-blue font-semibold'
                        : 'text-biyokaab-gray hover:bg-biyokaab-background'
                      }
                    `}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};


