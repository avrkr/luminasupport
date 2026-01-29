import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogs from './pages/AdminLogs';
import AdminSettings from './pages/AdminSettings';
import AdminOverview from './pages/AdminOverview';
import AgentDashboard from './pages/AgentDashboard';
import AgentCalls from './pages/AgentCalls';
import AgentStatus from './pages/AgentStatus';
import SupportLanding from './pages/SupportLanding';
import CustomerWidget from './components/CustomerWidget';
import Layout from './components/Layout';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute roles={['SUPER_ADMIN']}><Layout role="admin"><AdminOverview /></Layout></ProtectedRoute>} />
          <Route path="/admin/agents" element={<ProtectedRoute roles={['SUPER_ADMIN']}><Layout role="admin"><AdminDashboard /></Layout></ProtectedRoute>} />
          <Route path="/admin/logs" element={<ProtectedRoute roles={['SUPER_ADMIN']}><Layout role="admin"><AdminLogs /></Layout></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute roles={['SUPER_ADMIN']}><Layout role="admin"><AdminSettings /></Layout></ProtectedRoute>} />

          {/* Agent/Manager Routes */}
          <Route path="/agent" element={<ProtectedRoute roles={['AGENT', 'MANAGER']}><Layout role="agent"><AgentDashboard /></Layout></ProtectedRoute>} />
          <Route path="/agent/calls" element={<ProtectedRoute roles={['AGENT', 'MANAGER']}><Layout role="agent"><AgentCalls /></Layout></ProtectedRoute>} />
          <Route path="/agent/status" element={<ProtectedRoute roles={['AGENT', 'MANAGER']}><Layout role="agent"><AgentStatus /></Layout></ProtectedRoute>} />

          {/* Landing Page */}
          <Route path="/" element={<SupportLanding />} />
          <Route path="/support" element={<SupportLanding />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
