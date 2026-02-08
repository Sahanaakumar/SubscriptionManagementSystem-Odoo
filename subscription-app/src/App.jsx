import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import { Toaster } from 'react-hot-toast';

import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import UnauthorizedPage from './pages/auth/UnauthorizedPage';
import ChangePasswordPage from './pages/auth/ChangePasswordPage';

import DashboardHome from './pages/dashboard/DashboardHome';
import SubscriptionList from './pages/subscriptions/SubscriptionList';
import SubscriptionDetail from './pages/subscriptions/SubscriptionDetail';
import SubscriptionForm from './pages/subscriptions/SubscriptionForm';
import InvoiceList from './pages/invoices/InvoiceList';
import InvoiceDetail from './pages/invoices/InvoiceDetail';
import PaymentList from './pages/payments/PaymentList';

import PlanList from './pages/plans/PlanList';
import ProductList from './pages/products/ProductList';
import ProductForm from './pages/products/ProductForm';
import CustomerList from './pages/customers/CustomerList';
import CustomerDetail from './pages/customers/CustomerDetail';
import PlanForm from './pages/plans/PlanForm';
import UserManagement from './pages/users/UserManagement';
import SettingsPage from './pages/settings/SettingsPage';
import ReportsPage from './pages/reporting/ReportsPage';

// Placeholder component for routes not yet implemented
const Placeholder = ({ title }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <p className="text-gray-500">This feature is coming soon.</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
          </Route>

          {/* Protected Routes - All Roles */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'internal', 'customer']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/change-password" element={<ChangePasswordPage />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/admin/dashboard" element={<DashboardHome />} />
              <Route path="/internal/dashboard" element={<DashboardHome />} />

              <Route path="/subscriptions" element={<SubscriptionList />} />
              <Route path="/subscriptions/:id" element={<SubscriptionDetail />} />

              <Route path="/invoices" element={<InvoiceList />} />
              <Route path="/invoices/:id" element={<InvoiceDetail />} />

              <Route path="/payments" element={<PaymentList />} />
            </Route>
          </Route>

          {/* Admin & Internal Only */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'internal']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/subscriptions/new" element={<SubscriptionForm />} />

              <Route path="/plans" element={<PlanList />} />
              <Route path="/plans/new" element={<PlanForm />} />
              <Route path="/plans/:id" element={<PlanForm />} />

              <Route path="/products" element={<ProductList />} />
              <Route path="/products/new" element={<ProductForm />} />
              <Route path="/products/:id" element={<ProductForm />} />

              <Route path="/customers" element={<CustomerList />} />
              <Route path="/customers/:id" element={<CustomerDetail />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Route>
          </Route>

          {/* Admin Only */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/users" element={<UserManagement />} />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router >
  );
}

export default App;
