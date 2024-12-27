import { useAuth } from "../context/AuthContext";
import { apiService } from "../services/api.service";

export const useAuthActions = () => {
	const { dispatch } = useAuth();

	const login = async (credentials) => {
		dispatch({ type: "LOGIN_START" });
		try {
			const response = await apiService.login(credentials);
			console.log("response", response);
			localStorage.setItem("riderToken", response.token);
			dispatch({
				type: "LOGIN_SUCCESS",
				payload: { user: response.user, token: response.token },
			});
			return response;
		} catch (error) {
			dispatch({ type: "LOGIN_ERROR", payload: error.message });
			throw error;
		}
	};

	const signup = async (riderData) => {
		dispatch({ type: "LOGIN_START" });
		try {
			const response = await apiService.signup(riderData);
			console.log("response", response);
			localStorage.setItem("riderToken", response.token);
			dispatch({
				type: "LOGIN_SUCCESS",
				payload: { user: response.user, token: response.token },
			});
			return response;
		} catch (error) {
			dispatch({ type: "LOGIN_ERROR", payload: error.message });
			throw error;
		}
	};

	const logout = () => {
		localStorage.removeItem("riderToken");
		dispatch({ type: "LOGOUT" });
	};

	const clearError = () => {
		dispatch({ type: "CLEAR_ERROR" });
	};

	return { login, signup, logout, clearError };
};
