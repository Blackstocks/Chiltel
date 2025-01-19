import React from "react";
import useLocationTracking from "../hooks/useLocationTracking";

const LocationTracker = ({ apiEndpoint }) => {
	const { location, error, isTracking, isBackground } =
		useLocationTracking(apiEndpoint);

	return (
		<div className="p-4 bg-white rounded shadow">
			<h2 className="text-xl font-bold mb-4">Location Tracker</h2>
			<div className="space-y-2">
				<div className="flex items-center">
					<span
						className={`w-3 h-3 rounded-full mr-2 ${
							isTracking ? "bg-green-500" : "bg-red-500"
						}`}
					></span>
					<span>
						{isTracking
							? `Tracking ${isBackground ? "(Background)" : "(Active)"}`
							: "Tracking Inactive"}
					</span>
				</div>
				{error && <div className="text-red-500">Error: {error}</div>}
				{location && (
					<div className="space-y-1">
						<p>Latitude: {location.latitude}</p>
						<p>Longitude: {location.longitude}</p>
						<p>Last Updated: {new Date(location.timestamp).toLocaleString()}</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default LocationTracker;
