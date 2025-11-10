import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const NewTemplate = lazy(() => import('./pages/NewTemplate').then(m => ({ default: m.NewTemplate })));
const CreatedTemplates = lazy(() => import('./pages/CreatedTemplates').then(m => ({ default: m.CreatedTemplates })));
const TemplateDetail = lazy(() => import('./pages/TemplateDetail').then(m => ({ default: m.TemplateDetail })));
const EditTemplate = lazy(() => import('./pages/EditTemplate').then(m => ({ default: m.EditTemplate })));
const AddDevice = lazy(() => import('./pages/AddDevice').then(m => ({ default: m.AddDevice })));
const DeviceView = lazy(() => import('./pages/DeviceView').then(m => ({ default: m.DeviceView })));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      <div className="text-gray-500">Loading...</div>
    </div>
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
             // <Route path="/login" element={<Login />} />
              //<Route path="/signup" element={<Signup />} />
              <Route
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/templates"
                element={
                  <ProtectedRoute>
                    <CreatedTemplates />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/templates/new"
                element={
                  <ProtectedRoute>
                    <NewTemplate />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/templates/:id"
                element={
                  <ProtectedRoute>
                    <TemplateDetail />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/templates/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditTemplate />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/templates/:templateId/devices/new"
                element={
                  <ProtectedRoute>
                    <AddDevice />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/devices/:deviceId"
                element={
                  <ProtectedRoute>
                    <DeviceView />
                  </ProtectedRoute>
                }
              />
              
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
