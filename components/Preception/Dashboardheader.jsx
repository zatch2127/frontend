import React from 'react';
import { useDashboard } from './context/Dashboardcontext';
import { Asset } from 'expo-asset';
import logo from './assets/Image/KokoroLogo.png';

const DashboardHeader = () => {
  const { setIsMobileMenuOpen } = useDashboard();

  const logoUrl = Asset.fromModule(logo).uri || logo;

  return (
    <div className="relative mb-6 rounded-2xl overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-rose-500 to-pink-600" />
      
      {/* Decorative circles */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
        <div className="w-32 h-32 rounded-full bg-white" />
      </div>
      <div className="absolute right-20 top-8 opacity-30">
        <div className="w-16 h-16 rounded-full bg-white" />
      </div>
      <div className="absolute right-12 bottom-8 opacity-25">
        <div className="w-20 h-20 rounded-full bg-white" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden absolute top-4 left-4 text-white text-2xl hover:bg-white/20 rounded-lg p-2 transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          ☰
        </button>

        <div className="flex items-center gap-4 lg:ml-0 ml-12">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 p-2 flex items-center justify-center shadow-sm">
            <img
              src={logoUrl}
              alt="Kokoro Doctor"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome Doctor!
            </h1>
            <p className="text-white/90 text-base md:text-lg">
              Here is your Medical dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
