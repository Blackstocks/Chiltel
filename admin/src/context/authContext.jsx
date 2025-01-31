// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "");
  const [admin, setAdmin] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/login`,
        {
          email,
          password,
        }
      );
      console.log("response: ", response.data);
      const user = response.data;
      console.log("user", user)
      setToken(user.token);
      setUserRole(user.role);
      setAdmin(user);
      localStorage.setItem("admin", user);

      localStorage.setItem("token", user.token);
      localStorage.setItem("role", user.role);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  

  const logout = () => {
    setToken("");
    setUserRole("");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/"); // Add navigation
  };

  return (
    <AuthContext.Provider value={{ token, userRole, admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
