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
			setLoading(true);
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

		if (state.token) {
			fetchServices();
		}

		return () => {
			mounted = false;
		};
	}, [state.token]);

	const acceptService = async (serviceId) => {
		setLoading(true);
		try {
			const updatedService = await apiService.acceptService(
				state.token,
				serviceId
			);
			setLoading(false);
			return updatedService;
		} catch (err) {
			setError(err.message);
			setLoading(false);
			throw err;
		}
	};

	const declineService = async (serviceId) => {
		setLoading(true);
		try {
			const updatedService = await apiService.declineService(
				state.token,
				serviceId
			);
			setServices((prev) =>
				prev.filter((service) => service._id !== serviceId)
			);
			setLoading(false);
			return updatedService;
		} catch (err) {
			setError(err.message);
			setLoading(false);
			throw err;
		}
	};

	const completeService = async (serviceId) => {
		setLoading(true);
		try {
			const updatedService = await apiService.completeService(
				state.token,
				serviceId
			);
			setServices((prev) =>
				prev.filter((service) => service._id !== serviceId)
			);
			setLoading(false);
			return updatedService;
		} catch (err) {
			setError(err.message);
			setLoading(false);
			throw err;
		}
	};

	const updateServiceStatus = async (serviceId, status) => {
		setLoading(true);
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
			setLoading(false);
			return updatedService;
		} catch (err) {
			setError(err.message);
			setLoading(false);
			throw err;
		}
	};

	const getServiceHistory = async (page = 1, limit = 10) => {
		setLoading(true);
		try {
			const history = await apiService.getServiceHistory(
				state.token,
				page,
				limit
			);
			setLoading(false);
			return history;
		} catch (err) {
			setError(err.message);
			setLoading(false);
			throw err;
		}
	};

	const getActiveService = async () => {
		setLoading(true);
		try {
			const currentService = await apiService.getActiveService(state.token);
			setLoading(false);
			return currentService;
		} catch (err) {
			setError(err.message);
			setLoading(false);
			throw err;
		}
	};

	const getAcceptedServices = async () => {
		setLoading(true);
		try {
			const acceptedServices = await apiService.getAcceptedServices(
				state.token
			);
			setLoading(false);
			return acceptedServices;
		} catch (err) {
			setError(err.message);
			setLoading(false);
			throw err;
		}
	};

	const startService = async (serviceId) => {
		setLoading(true);
		try {
			const updatedService = await apiService.startService(
				state.token,
				serviceId
			);
			setLoading(false);
			return updatedService;
		} catch (err) {
			setError(err.message);
			setLoading(false);
			throw err;
		}
	};

	const addExtraWorks = async (serviceId, extraWorks) => {
		setLoading(true);
		try {
			const updatedService = await apiService.addExtraWorks(
				state.token,
				serviceId,
				extraWorks
			);
			setLoading(false);
			return updatedService;
		} catch (err) {
			setError(err.message);
			setLoading(false);
			throw err;
		}
	};

	const startWorking = async (serviceId) => {
		setLoading(true);
		try {
			const updatedService = await apiService.startWorking(
				state.token,
				serviceId
			);
			setLoading(false);
			return updatedService;
		} catch (err) {
			setError(err.message);
			setLoading(false);
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
		startService,
		addExtraWorks,
		startWorking,
	};
};
