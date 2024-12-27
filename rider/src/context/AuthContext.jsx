// src/context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { apiService } from "../services/api.service";

const AuthContext = createContext(null);

const initialState = {
	user: null,
	token: null,
	loading: true,
	error: null,
};

const authReducer = (state, action) => {
	switch (action.type) {
		case "LOGIN_START":
			return { ...state, loading: true, error: null };
		case "LOGIN_SUCCESS":
			return {
				...state,
				user: action.payload.user,
				token: action.payload.token,
				loading: false,
				error: null,
			};
		case "LOGIN_ERROR":
			return { ...state, loading: false, error: action.payload };
		case "LOGOUT":
			return { ...initialState, loading: false };
		case "CLEAR_ERROR":
			return { ...state, error: null };
		default:
			return state;
	}
};

export const AuthProvider = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, initialState);

	// Check for stored token on mount
	useEffect(() => {
		const initializeAuth = async () => {
			const storedToken = localStorage.getItem("riderToken");
			if (storedToken) {
				dispatch({ type: "LOGIN_START" });
				try {
					// Make a request to the backend to verify the token
					// and get the user data
					const response = await apiService.verifyToken(storedToken);
					dispatch({
						type: "LOGIN_SUCCESS",
						payload: { user: response.user, token: storedToken },
					});
				} catch (error) {
					dispatch({ type: "LOGIN_ERROR", payload: error.message });
				}
			} else {
				dispatch({ type: "LOGOUT" });
			}
		};

		initializeAuth();
	}, []);

	return (
		<AuthContext.Provider value={{ state, dispatch }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
