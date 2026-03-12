import React from 'react';
import { useDashboard } from './context/Dashboardcontext';
import PrescriptionPage from './pages/PrescriptionPage';
import AppointmentsPage from './pages/AppointmentsPage';
import PatientDetailsPage from './pages/PatientDetailsPage';
import NotificationPage from './pages/NotificationPage';
import ReminderPage from './pages/ReminderPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';

/* ================= Page Registry ================= */

const PAGE_MAP = {
  prescription: PrescriptionPage,
  appointments: AppointmentsPage,
  PatientDetails: PatientDetailsPage,
  home: () => <PlaceholderPage title="Home" icon="🏠" />,
  calendar: () => <PlaceholderPage title="Calendar" icon="📅" />,
  history: HistoryPage,
  reminder: ReminderPage,
  notification: NotificationPage,
  profile: () => <PlaceholderPage title="Profile" icon="👤" />,
  settings: SettingsPage,
  contact: () => <PlaceholderPage title="Contact Us" icon="💬" />,
  help: () => <PlaceholderPage title="Help" icon="❓" />
};

const DEFAULT_PAGE = 'prescription';

/* ================= Content Area ================= */

const ContentArea = () => {
  const { activeNav } = useDashboard();

  const PageComponent =
    PAGE_MAP[activeNav] || PAGE_MAP[DEFAULT_PAGE];

  return (
    <main className={`flex justify-center w-full ${activeNav === 'settings' ? '' : 'p-4 md:p-4'}`}>
      <PageComponent />
    </main>
  );
};

export default ContentArea;

/* ================= Placeholder Page ================= */

const PlaceholderPage = ({ title, icon }) => {
  return (
    <section className="w-full max-w-4xl bg-white rounded-2xl shadow-sm p-10 md:p-12 text-center">
      <div className="text-6xl mb-6">{icon}</div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        {title}
      </h2>
      <p className="text-gray-500 text-sm">
        This section is currently under development.
      </p>
    </section>
  );
};
