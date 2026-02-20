import React from 'react'
import { DashboardProvider } from '../components/Preception/context/Dashboardcontext'
import MainLayout from '../components/Preception/MainLayout'

const PrescriptionNavigation = ({ route }) => {
  const initialActiveNav =
    route?.params?.initialNav ||
    (route?.name === 'AppointmentsPage'
      ? 'appointments'
      : route?.name === 'PatientDetails'
      ? 'PatientDetails'
      : 'prescription');
  const initialSelectedSubscriber = route?.params?.selectedSubscriber || null;
  return (
    <DashboardProvider
      initialActiveNav={initialActiveNav}
      initialSelectedSubscriber={initialSelectedSubscriber}
    >
      <MainLayout/>
    </DashboardProvider>
  )
}

export default PrescriptionNavigation
