import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import SellerProducts from "./pages/Products";
import SellerLayout from "./components/SellerLayout";
import StoreSettings from "./pages/StoreSettings";
import HelpAndSupport from "./pages/HelpAndSupport";
import SellerDashboard from "./pages/Dashboard";
import { ToastContainer, toast } from "react-toastify";
import OrdersPage from "./pages/Orders";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={5000} />
        <Routes>
          {/* Public routes */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected routes within SellerLayout */}
          <Route
            element={
              <ProtectedRoute>
                <SellerLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<SellerDashboard />} />
            <Route path="/products" element={<SellerProducts />} />
            <Route path="/store" element={<StoreSettings />} />
            <Route path="/support" element={<HelpAndSupport />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Route>

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
