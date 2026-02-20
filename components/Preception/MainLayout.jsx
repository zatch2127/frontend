import React from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/Maincontent';
import ChatAssistant from './components/ChatAssistant/ChatAssistant';
import { useDashboard } from './context/Dashboardcontext';
import { Asset } from 'expo-asset';
import Background from './assets/Image/Background.jpg';


const MainLayout = () => {
  const { isMobileMenuOpen, setIsMobileMenuOpen, activeNav } = useDashboard();
  const backgroundUrl = Asset.fromModule(Background).uri || Background;
  const isAppointmentsRoute =
    typeof window !== 'undefined' &&
    (window.location.pathname === '/AppointmentsPage' ||
      window.location.pathname === '/appointments' ||
      window.location.search.includes('initialNav=appointments'));
  const isPrescriptionRoute =
    typeof window !== 'undefined' &&
    (window.location.pathname === '/prescription' ||
      window.location.search.includes('initialNav=prescription'));
  const hideChatAssistant =
    activeNav === 'appointments' ||
    activeNav === 'prescription' ||
    isAppointmentsRoute ||
    isPrescriptionRoute;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="relative flex-1 lg:ml-64 transition-all duration-300 min-h-screen w-full max-w-full overflow-x-hidden">
        <div
          className=" h-full fixed inset-0 z-0 hidden lg:block absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
        />
        <div className="relative min-h-screen z-10">
          <MainContent />
        </div>
      </main>


      {/* Floating Chat Assistant */}
    </div>
  );
};

export default MainLayout;
