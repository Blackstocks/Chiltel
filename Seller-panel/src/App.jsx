// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/authPage";
//import Dashboard from './pages/Dashboard';
import SellerProducts from "./pages/Products";
import AddProductForm from "./components/AddProductForm";
import SellerLayout from "./components/SellerLayout";
//import Orders from './pages/Orders';
// Import other pages as needed

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<SellerLayout />}>
            {/* Public Routes */}

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute></ProtectedRoute>}
            />

            <Route path="/products" element={<SellerProducts />} />

            <Route path="/orders" element={<ProtectedRoute></ProtectedRoute>} />

            {/* Redirect root to dashboard if authenticated, otherwise to login */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
