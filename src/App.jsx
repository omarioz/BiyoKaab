import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { TopNav } from './components/layout/TopNav';
import { SideNav } from './components/layout/SideNav';
import { MobileNav } from './components/layout/MobileNav';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { WaterManagement } from './pages/WaterManagement';
import { BiyokaabAi } from './pages/BiyokaabAi';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { useUIStore } from './store/uiStore';

const AppLayout = () => {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-biyokaab-background">
      <TopNav />
      <SideNav />

      <main
        className={`
          transition-all duration-300
          ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
          pt-14 sm:pt-16
          pb-20 lg:pb-0
        `}
      >
        <Outlet />
      </main>

      <MobileNav />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page - no layout */}
        <Route path="/" element={<Landing />} />

        {/* App layout pages */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/water-management" element={<WaterManagement />} />
          <Route path="/ai" element={<BiyokaabAi />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

