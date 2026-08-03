import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { RoleSwitcherBar } from './components/common/RoleSwitcherBar';
import { Sidebar } from './components/common/Sidebar';

import { Login } from './pages/Login';
import { Register } from './pages/Register';

import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { DoctorDashboard } from './pages/dashboards/DoctorDashboard';
import { ReceptionistDashboard } from './pages/dashboards/ReceptionistDashboard';
import { PatientDashboard } from './pages/dashboards/PatientDashboard';

import { AppointmentsPage } from './pages/AppointmentsPage';
import { PatientsPage } from './pages/PatientsPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { BillingPage } from './pages/BillingPage';
import { AuditLogsPage } from './pages/AuditLogsPage';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center font-semibold text-sm">
        Initializing CarePlus Enterprise HIS...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    switch (user.role) {
      case 'ADMIN': return <Navigate to="/admin" replace />;
      case 'DOCTOR': return <Navigate to="/doctor-dashboard" replace />;
      case 'RECEPTIONIST': return <Navigate to="/reception-dashboard" replace />;
      case 'PATIENT': default: return <Navigate to="/patient-dashboard" replace />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <RoleSwitcherBar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-12">
          {children}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Role Dashboards */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/doctor-dashboard" element={<ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN']}><DoctorDashboard /></ProtectedRoute>} />
            <Route path="/reception-dashboard" element={<ProtectedRoute allowedRoles={['RECEPTIONIST', 'ADMIN']}><ReceptionistDashboard /></ProtectedRoute>} />
            <Route path="/patient-dashboard" element={<ProtectedRoute allowedRoles={['PATIENT', 'ADMIN']}><PatientDashboard /></ProtectedRoute>} />

            {/* General Shared Features */}
            <Route path="/appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
            <Route path="/patients" element={<ProtectedRoute><PatientsPage /></ProtectedRoute>} />
            <Route path="/doctors" element={<ProtectedRoute><DoctorsPage /></ProtectedRoute>} />
            <Route path="/departments" element={<ProtectedRoute><DepartmentsPage /></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
            <Route path="/medical-records" element={<ProtectedRoute allowedRoles={['PATIENT', 'ADMIN']}><PatientDashboard /></ProtectedRoute>} />
            <Route path="/audit-logs" element={<ProtectedRoute allowedRoles={['ADMIN']}><AuditLogsPage /></ProtectedRoute>} />

            {/* Default Root & Catch-All Redirect */}
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
