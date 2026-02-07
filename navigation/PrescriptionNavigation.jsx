import React from 'react'
import { DashboardProvider } from '../components/Preception/context/Dashboardcontext'
import MainLayout from '../components/Preception/MainLayout'

const PrescriptionNavigation = ({ route }) => {
  const initialActiveNav =
    route?.params?.initialNav || (route?.name === 'AppointmentsPage' ? 'appointments' : 'prescription');
  return (
    <DashboardProvider initialActiveNav={initialActiveNav}>
      <MainLayout/>
    </DashboardProvider>
  )
}

export default PrescriptionNavigation
