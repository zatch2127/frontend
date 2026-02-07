import React from 'react';
import DashboardHeader from '../../Dashboardheader';
import ContentArea from '../../Contentarea';

const MainContent = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <DashboardHeader />
      <ContentArea />
    </div>
  );
};

export default MainContent;
