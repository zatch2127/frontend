import React from 'react';
import { useDashboard } from './context/Dashboardcontext';
import { Asset } from 'expo-asset';
import logo from './assets/Image/KokoroLogo.png';

const DashboardHeader = () => {
  const { setIsMobileMenuOpen, activeNav } = useDashboard();

  const logoUrl = Asset.fromModule(logo).uri || logo;

  const getHeaderContent = () => {
    if (activeNav === 'prescription' || activeNav === 'appointments') {
      return {
        title: 'Welcome Doctor!',
        subtitle: 'Here is your Medical dashboard'
      };
    }

    // Default: Capitalize activeNav
    const title = activeNav.charAt(0).toUpperCase() + activeNav.slice(1);
    return {
      title: title,
      subtitle: '' // Or some default subtitle if needed
    };
  };

  const { title, subtitle } = getHeaderContent();

  return (
    <div className="relative mb-6 rounded-2xl overflow-hidden bg-transparent">
      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4">

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden absolute top-0 left-0 text-gray-800 text-2xl p-2"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          ☰
        </button>

        <div className="lg:ml-0 ml-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
            {title}
          </h1>
          {subtitle && (
            <p className="text-white/80 text-sm md:text-base">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 self-end md:self-auto">
          {/* Notification */}
          <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors">
            <span className="text-xl">🔔</span>
          </button>

          {/* Profile */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
              {/* Placeholder for user image if not available */}
              <img src="https://ui-avatars.com/api/?name=Dr+Buddy&background=random" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <span className="text-white text-sm">▼</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
