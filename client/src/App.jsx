import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider }  from './contexts/AuthContext';
import Home              from './pages/Home';
import AdminPortal       from './pages/AdminPortal';
import AdminDashboard    from './pages/AdminDashboard';
import ProtectedRoute    from './components/ProtectedRoute';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />

            {/* Admin login (hidden route) */}
            <Route path="/admin-portal" element={<AdminPortal />} />

            {/* Protected admin dashboard */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch-all → home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
