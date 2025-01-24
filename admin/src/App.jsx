import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/Products';
import RiderManagement from './pages/Riders';
import ServicesManagement from './pages/Services';
import OrderManagement from './pages/Orders';
import Sellers from './pages/Sellers';
import SellerSupportTickets from './pages/SellerSupportTicket';
import Login from './pages/Login';
import { useAuth } from './context/authContext';
import Register from './pages/Register';
import SubAdminManagement from './pages/SubAdmins';
import Profile from './pages/Profile';

// App.jsx
const App = () => {
  const { token, userRole, logout } = useAuth();
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={token ? <Register /> : <Navigate to="/" />} />
 
        {/* Protected Routes */}
        {token ? (
          <Route element={
            <div className="flex h-screen">
              <Sidebar userRole={userRole} handleLogout={logout} />
              <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <Outlet />
              </main>
            </div>
          }>
            <Route path="/profile" element={<SecuredRoute roles={["super-admin", "sub-admin"]}><Profile /></SecuredRoute>} />
            <Route path="/sub-admins" element={<SecuredRoute roles={["super-admin"]}><SubAdminManagement /></SecuredRoute>} />
            <Route path="/dashboard" element={<SecuredRoute roles={["super-admin", "sub-admin"]}><Dashboard /></SecuredRoute>} />
            <Route path="/products" element={<SecuredRoute roles={["super-admin", "sub-admin"]}><ProductsPage /></SecuredRoute>} />
            <Route path="/services" element={<SecuredRoute roles={["super-admin", "sub-admin"]}><ServicesManagement /></SecuredRoute>} />
            <Route path="/riders" element={<SecuredRoute roles={["super-admin"]}><RiderManagement /></SecuredRoute>} />
            <Route path="/orders" element={<SecuredRoute roles={["super-admin", "sub-admin"]}><OrderManagement /></SecuredRoute>} />
            <Route path="/sellers" element={<SecuredRoute roles={["super-admin"]}><Sellers /></SecuredRoute>} />
            <Route path="/supportTickets" element={<SecuredRoute roles={["super-admin", "sub-admin"]}><SellerSupportTickets /></SecuredRoute>} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </div>
  );
 };

 const AccessDenied = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <h2 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h2>
    <p className="text-gray-600">You need super-admin privileges to access this page.</p>
  </div>
 );
 
 // Update SecuredRoute
 const SecuredRoute = ({ children, roles }) => {
  const { userRole } = useAuth();
  
  if (!roles.includes(userRole)) {
    return <AccessDenied />;
  }
  return children;
};

export default App;