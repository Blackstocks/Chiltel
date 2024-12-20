import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiService } from "../services/api.service";
import { wsService } from "../services/websocket.service";

export const useLocation = () => {
	const { state } = useAuth();
	const [location, setLocation] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		let watchId;

		const startLocationTracking = () => {
			if ("geolocation" in navigator) {
				watchId = navigator.geolocation.watchPosition(
					async (position) => {
						const newLocation = {
							latitude: position.coords.latitude,
							longitude: position.coords.longitude,
						};

						setLocation(newLocation);

						// Update location via WebSocket
						wsService.updateLocation(newLocation);

						// Also update via REST API periodically
						try {
							await apiService.updateLocation(state.token, newLocation);
						} catch (err) {
							console.error("Failed to update location:", err);
						}
					},
					(err) => {
						setError(err.message);
					},
					{
						enableHighAccuracy: true,
						timeout: 5000,
						maximumAge: 0,
					}
				);
			} else {
				setError("Geolocation is not supported by this browser.");
			}
		};

		if (state.token) {
			startLocationTracking();
		}

		return () => {
			if (watchId) {
				navigator.geolocation.clearWatch(watchId);
			}
		};
	}, [state.token]);

	return { location, error };
};
