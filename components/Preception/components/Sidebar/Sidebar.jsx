import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDashboard } from '../../context/Dashboardcontext';
import NavItem from '../../NavItem';
import { Asset } from 'expo-asset';
import Logo from '../../assets/Image/KokoroLogo.png';

const Sidebar = () => {
  const { isMobileMenuOpen, setIsMobileMenuOpen, activeNav, setActiveNav } = useDashboard();
  const navigation = useNavigation();

  const mainNavItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'calendar', icon: '📅', label: 'Calendar' },
    { id: 'appointments', icon: '📋', label: 'Appointments' },
    { id: 'prescription', icon: '📝', label: 'Prescription' },
    { id: 'history', icon: '🕐', label: 'History' },
    { id: 'reminder', icon: '⏰', label: 'Reminder' },
    { id: 'notification', icon: '🔔', label: 'Notification' },
  ];

  const bottomNavItems = [
    { id: 'profile', icon: '👤', label: 'Profile' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
    { id: 'contact', icon: '💬', label: 'Contact us' },
    { id: 'help', icon: '❓', label: 'Help' },
  ];

  const handleNavClick = (id) => {
    setActiveNav(id);
    setIsMobileMenuOpen(false);

    if (id === 'appointments') {
      navigation.navigate('AppointmentsPage');
    }

    if (id === 'prescription') {
      navigation.navigate('Prescription');
    }
  };

  const logoUrl = Asset.fromModule(Logo).uri || Logo;

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen w-64 z-50
        bg-gradient-to-b from-gray-50 to-white
        border-r border-gray-200
        flex flex-col
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}
    >
      {/* Logo Section */}
      {/* <Logo /> */}
      <div className="px-4 py-5 flex items-center justify-center border-b ">
        <img
          src={logoUrl}
          alt="Kokoro Logo"
          className="h-10 w-auto object-contain"
        />
      </div>
      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeNav === item.id}
              onClick={() => handleNavClick(item.id)}
            />
          ))}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <nav className="px-3 pb-4 border-t border-gray-200 pt-4">
        <div className="space-y-1">
          {bottomNavItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeNav === item.id}
              onClick={() => handleNavClick(item.id)}
            />
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
