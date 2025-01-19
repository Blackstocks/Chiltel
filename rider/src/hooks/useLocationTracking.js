// useLocationTracking.js
import { useState, useEffect } from "react";

// Utility function to store locations in localStorage as fallback
const storeLocation = (location) => {
	try {
		const stored = JSON.parse(localStorage.getItem("pendingLocations") || "[]");
		stored.push(location);
		localStorage.setItem("pendingLocations", JSON.stringify(stored));
	} catch (err) {
		console.error("Error storing location:", err);
	}
};

// Utility function to sync stored locations
const syncStoredLocations = async (apiEndpoint) => {
	try {
		const stored = JSON.parse(localStorage.getItem("pendingLocations") || "[]");
		if (stored.length === 0) return;

		const successfulSync = [];

		for (let i = 0; i < stored.length; i++) {
			try {
				const response = await fetch(apiEndpoint, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(stored[i]),
				});

				if (response.ok) {
					successfulSync.push(i);
				}
			} catch (err) {
				console.error("Failed to sync location:", err);
			}
		}

		// Remove successfully synced locations
		const remaining = stored.filter(
			(_, index) => !successfulSync.includes(index)
		);
		localStorage.setItem("pendingLocations", JSON.stringify(remaining));
	} catch (err) {
		console.error("Error syncing stored locations:", err);
	}
};

const useLocationTracking = (apiEndpoint, intervalInMs = 60000) => {
	const [location, setLocation] = useState(null);
	const [error, setError] = useState(null);
	const [isTracking, setIsTracking] = useState(false);
	const [backgroundTab, setBackgroundTab] = useState(false);

	// Handle visibility change
	useEffect(() => {
		const handleVisibilityChange = () => {
			const isHidden = document.hidden;
			setBackgroundTab(isHidden);

			// Sync stored locations when tab becomes visible
			if (!isHidden) {
				syncStoredLocations(apiEndpoint);
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, [apiEndpoint]);

	// Setup beacon for background data sending
	useEffect(() => {
		const sendBeacon = (data) => {
			if ("sendBeacon" in navigator) {
				const blob = new Blob([JSON.stringify(data)], {
					type: "application/json",
				});
				navigator.sendBeacon(apiEndpoint, blob);
			}
		};

		// Attempt to send any remaining data when page is about to unload
		const handleUnload = () => {
			const stored = JSON.parse(
				localStorage.getItem("pendingLocations") || "[]"
			);
			stored.forEach(sendBeacon);
		};

		window.addEventListener("beforeunload", handleUnload);
		return () => {
			window.removeEventListener("beforeunload", handleUnload);
		};
	}, [apiEndpoint]);

	// Main location tracking logic
	useEffect(() => {
		let watchId = null;
		let intervalId = null;

		const sendLocationToBackend = async (position) => {
			const locationData = {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
				timestamp: new Date().toISOString(),
				accuracy: position.coords.accuracy,
			};

			try {
				if (backgroundTab) {
					// Store location if in background
					storeLocation(locationData);
				} else {
					// Attempt immediate sync if in foreground
					const response = await fetch(apiEndpoint, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(locationData),
						// Ensure request completes even if tab is closed
						keepalive: true,
					});

					if (!response.ok) {
						storeLocation(locationData);
					}
				}

				setLocation(locationData);
			} catch (err) {
				storeLocation(locationData);
				setError("Error sending location: " + err.message);
			}
		};

		const startTracking = async () => {
			try {
				const permission = await navigator.permissions.query({
					name: "geolocation",
				});

				if (permission.state === "denied") {
					throw new Error("Location permission denied");
				}

				// Set up primary tracking
				watchId = navigator.geolocation.watchPosition(
					sendLocationToBackend,
					(err) => setError(err.message),
					{
						enableHighAccuracy: true,
						maximumAge: 30000,
						timeout: 27000,
					}
				);

				// Backup interval for redundancy
				intervalId = setInterval(() => {
					navigator.geolocation.getCurrentPosition(
						sendLocationToBackend,
						(err) => console.error("Interval position error:", err),
						{ maximumAge: 30000, timeout: 27000 }
					);
				}, intervalInMs);

				setIsTracking(true);
			} catch (err) {
				setError("Failed to start tracking: " + err.message);
			}
		};

		if ("geolocation" in navigator) {
			startTracking();
		} else {
			setError("Geolocation is not supported by this browser");
		}

		// Cleanup
		return () => {
			if (watchId) navigator.geolocation.clearWatch(watchId);
			if (intervalId) clearInterval(intervalId);
			setIsTracking(false);
		};
	}, [apiEndpoint, intervalInMs, backgroundTab]);

	return {
		location,
		error,
		isTracking,
		isBackground: backgroundTab,
	};
};

export default useLocationTracking;
