import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiService } from "../services/api.service";

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
		}

		return () => {
			mounted = false;
		};
	}, [state.token]);

	const acceptService = async (serviceId) => {
		try {
			const updatedService = await apiService.acceptService(
				state.token,
				serviceId
			);
			setServices(updatedService);
			return updatedService;
		} catch (err) {
			setError(err.message);
			throw err;
		}
	};

	const declineService = async (serviceId) => {
		try {
			const updatedService = await apiService.declineService(
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

	const getServiceHistory = async (page = 1, limit = 10) => {
		try {
			const history = await apiService.getServiceHistory(
				state.token,
				page,
				limit
			);
			return history;
		} catch (err) {
			setError(err.message);
			throw err;
		}
	};

	const getActiveService = async () => {
		try {
			const currentService = await apiService.getActiveService(state.token);
			return currentService;
		} catch (err) {
			setError(err.message);
			throw err;
		}
	};

	const getAcceptedServices = async () => {
		try {
			const acceptedServices = await apiService.getAcceptedServices(
				state.token
			);
			return acceptedServices;
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
		declineService,
		completeService,
		updateServiceStatus,
		getActiveService,
		getServiceHistory,
		getAcceptedServices,
	};
};
