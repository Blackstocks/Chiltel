import "./App.css";
import RiderDashboard from "./pages/RiderDashboard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RiderAuth from "./pages/RiderAuth";
import { AuthProvider } from "./context/AuthContext";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import LocationTracker from "./components/LocationTracker";

const ProtectedRoute = ({ children }) => {
	const { state } = useAuth();
	const navigate = useNavigate(); // Assuming you're using react-router

	useEffect(() => {
		if (!state.loading && !state.token) {
			navigate("/auth");
		}
	}, [state.loading, state.token, navigate]);

	if (state.loading) {
		return <div>Loading...</div>;
	}

	return state.token ? children : null;
};

function App() {
	return (
		<AuthProvider>
			{/* <LocationTracker apiEndpoint="http://localhost:4000/api/rider/location" /> */}
			<Router>
				<Routes>
					<Route
						path="/"
						element={
							<ProtectedRoute>
								<RiderDashboard />
							</ProtectedRoute>
						}
					/>
					<Route path="/auth" element={<RiderAuth />} />
					<Route path="*" element={<div>404 Not Found</div>} />
				</Routes>
			</Router>
		</AuthProvider>
	);
}

export default App;
