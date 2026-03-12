import React from 'react';
import DashboardHeader from '../../Dashboardheader';
import ContentArea from '../../Contentarea';
import { useDashboard } from '../../context/Dashboardcontext';

const MainContent = () => {
  const { activeNav } = useDashboard();

  // Remove padding if activeNav is settings to allow full-width secondary sidebar
  const containerClass = activeNav === 'settings'
    ? "h-full flex flex-col w-full"
    : "p-4 md:p-6 lg:p-8 flex flex-col min-h-screen w-full";

  return (
    <div className={containerClass}>
      <div className={activeNav === 'settings' ? "p-4 md:p-6 lg:px-8 lg:pt-8 w-full" : "w-full"}>
        <DashboardHeader />
      </div>
      <ContentArea />
    </div>
  );
};

export default MainContent;
