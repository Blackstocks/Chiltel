import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { ShopContext } from './ShopContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const {backendUrl} = useContext(ShopContext);

  const checkAuthStatus = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get(backendUrl + '/api/user/verify', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.status === 200) {
          // If the token is valid, store user data
          setUser(response.data); // assuming the user data is in response.data
          setIsAuthenticated(true);
        } else {
          // If the token is invalid, remove it and reset auth state
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        // If no token exists, reset auth state
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
      // Optionally, you could show a toast here to notify the user about the error.
      toast.error('Failed to check authentication. Please try again.');
    } finally {
      setLoading(false); // Set loading to false once the check is done
    }
  };

  // const checkAuthStatus = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     if (token) {
  //       const response = await fetch('/api/auth/verify', {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       });
  //       if (response.ok) {
  //         const userData = await response.json();
  //         setUser(userData);
  //         setIsAuthenticated(true);
  //       } else {
  //         localStorage.removeItem('token');
  //         setUser(null);
  //         setIsAuthenticated(false);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Auth check failed:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(backendUrl + '/api/user/login', {email,password});

      if (response.status === 200) {
        // Store the token and user data in local storage and state
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);

        return { success: true };
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login Error:', error);
      return { success: false, error: error.response ? error.response.data.message : error.message };
    }
  };


  // const login = async (email, password) => {
  //   try {
  //     const response = await fetch('/api/auth/login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ email, password })
  //     });
      
  //     if (!response.ok) {
  //       throw new Error('Login failed');
  //     }

  //     const data = await response.json();
  //     localStorage.setItem('token', data.token);
  //     setUser(data.user);
  //     setIsAuthenticated(true);
  //     return { success: true };
  //   } catch (error) {
  //     return { success: false, error: error.message };
  //   }
  // };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuthStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;