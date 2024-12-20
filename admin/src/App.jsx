import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/Products';
import EmployeeManagement from './pages/Employee';
import ServicesManagement from './pages/Services';
import OrderManagement from './pages/Orders';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = '$';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100" >
          <Navbar setToken={setToken} />
          <hr className="border-gray-200" />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="w-full h-full">
                <Routes>
                <Route path="/" element={<Dashboard token={token} />} />
                  <Route path="/dashboard" element={<Dashboard token={token} />} />
                  <Route path="/products" element={<ProductsPage token={token} />} />
                  <Route path="/services" element={<ServicesManagement token={token} />} />
                  <Route path="/employees" element={<EmployeeManagement token={token} />} />
                  <Route path="/orders" element={<OrderManagement token={token} />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;