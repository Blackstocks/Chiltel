import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { ShopContext } from "./ShopContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);
	const { backendUrl } = useContext(ShopContext);

	const navigate = useNavigate();

	const checkAuthStatus = async () => {
		setLoading(true);
		const token = localStorage.getItem("chiltel-user-token");
		if (!token) {
			setIsAuthenticated(false);
			setUser(null);
			setLoading(false);
			return;
		}
	};
	useEffect(() => {
		checkAuthStatus();
	}, []);

	const login = async (email, password) => {
		try {
			const response = await axios.post(backendUrl + "/api/user/login", {
				email,
				password,
			});

			if (response.status === 200) {
				// Store the token and user data in local storage and state
				localStorage.setItem("chiltel-user-token", response.data.token);
				setUser(response.data.user);
				setIsAuthenticated(true);
				toast.success("Logged in successfully");
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			console.error("Error logging in:", error);
			toast.error("Failed to log in. Please try again.");
		}
	};

	const signup = async (email, password, name) => {
		try {
			const response = await axios.post(backendUrl + "/api/user/register", {
				email,
				password,
				name,
			});

			if (response.status === 200) {
				// Store the token and user data in local storage and state
				localStorage.setItem("chiltel-user-token", response.data.token);
				setUser(response.data.user);
				setIsAuthenticated(true);
				toast.success("Signed up successfully");
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			console.error("Error signing up:", error);
			toast.error("Failed to sign up. Please try again.");
		}
	};

	const logout = () => {
		localStorage.removeItem("chiltel-user-token");
		toast.success("Logged out successfully");
		setUser(null);
		setIsAuthenticated(false);
		navigate("/login");
	};

	const value = {
		user,
		isAuthenticated,
		loading,
		login,
		signup,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export default AuthContext;
