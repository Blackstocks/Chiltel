import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiService } from "../services/api.service";
import { wsService } from "../services/websocket.service";

export const useServices = () => {
	const { state } = useAuth();
	const [services, setServices] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let mounted = true;

		const fetchServices = async () => {
			try {
				const data = await apiService.getAssignedServices(state.token);
				if (mounted) {
					setServices(data);
					setLoading(false);
				}
			} catch (err) {
				if (mounted) {
					setError(err.message);
					setLoading(false);
				}
			}
		};

		const handleNewService = (service) => {
			setServices((prev) => [...prev, service]);
		};

		const handleServiceUpdate = (updatedService) => {
			setServices((prev) =>
				prev.map((service) =>
					service._id === updatedService._id ? updatedService : service
				)
			);
		};

		if (state.token) {
			fetchServices();
			wsService.on("newService", handleNewService);
			wsService.on("serviceUpdate", handleServiceUpdate);
		}

		return () => {
			mounted = false;
			wsService.off("newService", handleNewService);
			wsService.off("serviceUpdate", handleServiceUpdate);
		};
	}, [state.token]);

	const acceptService = async (serviceId) => {
		try {
			const updatedService = await apiService.acceptService(
				state.token,
				serviceId
			);
			setServices((prev) =>
				prev.map((service) =>
					service._id === serviceId ? updatedService : service
				)
			);
			return updatedService;
		} catch (err) {
			setError(err.message);
			throw err;
		}
	};

	const completeService = async (serviceId) => {
		try {
			const updatedService = await apiService.completeService(
				state.token,
				serviceId
			);
			setServices((prev) =>
				prev.filter((service) => service._id !== serviceId)
			);
			return updatedService;
		} catch (err) {
			setError(err.message);
			throw err;
		}
	};

	const updateServiceStatus = async (serviceId, status) => {
		try {
			const updatedService = await apiService.updateServiceStatus(
				state.token,
				serviceId,
				status
			);
			setServices((prev) =>
				prev.map((service) =>
					service._id === serviceId ? updatedService : service
				)
			);
			return updatedService;
		} catch (err) {
			setError(err.message);
			throw err;
		}
	};

	return {
		services,
		loading,
		error,
		acceptService,
		completeService,
		updateServiceStatus,
	};
};
