import React, { createContext, useContext, useState } from 'react';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children, initialActiveNav = 'prescription' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [activeNav, setActiveNav] = useState(initialActiveNav);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);

  const value = {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isChatOpen,
    setIsChatOpen,
    uploadedFiles,
    setUploadedFiles,
    activeNav,
    setActiveNav,
    selectedSubscriber,
    setSelectedSubscriber,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
