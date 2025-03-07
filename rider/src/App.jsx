import "./App.css";
import RiderDashboard from "./pages/RiderDashboard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RiderAuth from "./pages/RiderAuth";
import { AuthProvider } from "./context/AuthContext";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import LocationTracker from "./components/LocationTracker";
import Terms from "./pages/Terms";
import RegisterServiceWorker from "./lib/pwa/RegisterServiceWorker";
import Loader from "./components/Loader";

const ProtectedRoute = ({ children }) => {
	const { state } = useAuth();
	const navigate = useNavigate(); // Assuming you're using react-router

	useEffect(() => {
		if (!state.loading && !state.token) {
			navigate("/auth");
		}
	}, [state.loading, state.token, navigate]);

	if (state.loading) {
		return <Loader />;
	}

	return state.token ? children : null;
};

function App() {
	RegisterServiceWorker();
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
					<Route path="/terms" element={<Terms />} />
					<Route path="*" element={<div>404 Not Found</div>} />
				</Routes>
			</Router>
		</AuthProvider>
	);
}

export default App;

//Partner panel developed by blackstocks
