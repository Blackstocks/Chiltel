// src/services/api.service.js
const API_BASE_URL =
	import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

class ApiService {
	constructor() {
		this.baseURL = API_BASE_URL;
	}

	getHeaders(token = null) {
		const headers = {
			"Content-Type": "application/json",
		};

		if (token) {
			headers["Authorization"] = `Bearer ${token}`;
		}

		return headers;
	}

	async handleResponse(response) {
		if (!response.ok) {
			const error = await response.json();
			console.error(error);
			throw new Error(error.message || "API request failed");
		}
		return response.json();
	}

	// Auth endpoints
	async login(credentials) {
		const response = await fetch(`${this.baseURL}/rider/login`, {
			method: "POST",
			headers: this.getHeaders(),
			body: JSON.stringify(credentials),
		});
		return this.handleResponse(response);
	}

	async signup(riderData) {
		const response = await fetch(`${this.baseURL}/rider/signup`, {
			method: "POST",
			headers: this.getHeaders(),
			body: JSON.stringify(riderData),
		});
		return this.handleResponse(response);
	}

	async logout(token) {
		const response = await fetch(`${this.baseURL}/rider/logout`, {
			method: "POST",
			headers: this.getHeaders(token),
		});
		return this.handleResponse(response);
	}

	async verifyToken(token) {
		const response = await fetch(`${this.baseURL}/rider/verify-token`, {
			method: "GET",
			headers: this.getHeaders(token),
		});
		return this.handleResponse(response);
	}

	// Profile endpoints
	async getProfile(token) {
		const response = await fetch(`${this.baseURL}/rider/profile`, {
			headers: this.getHeaders(token),
		});
		console.log(response);
		return this.handleResponse(response);
	}

	async updateProfile(token, profileData) {
		const response = await fetch(`${this.baseURL}/rider/profile`, {
			method: "PUT",
			headers: this.getHeaders(token),
			body: JSON.stringify(profileData),
		});
		return this.handleResponse(response);
	}

	async updateLocation(token, location) {
		const response = await fetch(`${this.baseURL}/rider/location`, {
			method: "PUT",
			headers: this.getHeaders(token),
			body: JSON.stringify(location),
		});
		return this.handleResponse(response);
	}

	// Service endpoints
	async getAssignedServices(token) {
		const response = await fetch(`${this.baseURL}/rider/services`, {
			headers: this.getHeaders(token),
		});
		return this.handleResponse(response);
	}

	async getActiveService(token) {
		const response = await fetch(`${this.baseURL}/rider/services/active`, {
			headers: this.getHeaders(token),
		});
		return this.handleResponse(response);
	}

	async getAcceptedServices(token) {
		const response = await fetch(`${this.baseURL}/rider/services/accepted`, {
			headers: this.getHeaders(token),
		});
		return this.handleResponse(response);
	}

	async getServiceHistory(token, page = 1, limit = 10) {
		const response = await fetch(
			`${this.baseURL}/rider/services/history?page=${page}&limit=${limit}`,
			{
				headers: this.getHeaders(token),
			}
		);
		return this.handleResponse(response);
	}

	async acceptService(token, serviceId) {
		const response = await fetch(
			`${this.baseURL}/rider/services/${serviceId}/accept`,
			{
				method: "POST",
				headers: this.getHeaders(token),
			}
		);
		return this.handleResponse(response);
	}

	async declineService(token, serviceId) {
		const response = await fetch(
			`${this.baseURL}/rider/services/${serviceId}/decline`,
			{
				method: "POST",
				headers: this.getHeaders(token),
			}
		);
		return this.handleResponse(response);
	}

	async startService(token, serviceId) {
		const response = await fetch(
			`${this.baseURL}/rider/services/${serviceId}/start`,
			{
				method: "POST",
				headers: this.getHeaders(token),
			}
		);
		return this.handleResponse(response);
	}

	async addExtraWorks(token, serviceId, extraWorks) {
		const response = await fetch(
			`${this.baseURL}/rider/services/${serviceId}/extra-works`,
			{
				method: "POST",
				headers: this.getHeaders(token),
				body: JSON.stringify({ extraWorks }),
			}
		);
		return this.handleResponse(response);
	}

	async startWorking(token, serviceId) {
		const response = await fetch(
			`${this.baseURL}/rider/services/${serviceId}/start-working`,
			{
				method: "POST",
				headers: this.getHeaders(token),
			}
		);
		return this.handleResponse(response);
	}

	async completeService(token, serviceId) {
		const response = await fetch(
			`${this.baseURL}/rider/services/${serviceId}/complete`,
			{
				method: "POST",
				headers: this.getHeaders(token),
			}
		);
		return this.handleResponse(response);
	}

	async updateServiceStatus(token, serviceId, status) {
		const response = await fetch(
			`${this.baseURL}/rider/services/${serviceId}/status`,
			{
				method: "PUT",
				headers: this.getHeaders(token),
				body: JSON.stringify({ status }),
			}
		);
		return this.handleResponse(response);
	}

	async markAttendance(token, body) {
		const response = await fetch(`${this.baseURL}/rider/mark-attendance`, {
			method: "POST",
			headers: this.getHeaders(token),
			body: JSON.stringify({ ...body }),
		});
		return this.handleResponse(response);
	}

	async getAttendance(token) {
		const response = await fetch(`${this.baseURL}/rider/attendance`, {
			headers: this.getHeaders(token),
		});
		return this.handleResponse(response);
	}

	async addFaults(token, serviceId, faults) {
		const response = await fetch(
			`${this.baseURL}/rider/services/${serviceId}/add-faults`,
			{
				method: "POST",
				headers: this.getHeaders(token),
				body: JSON.stringify({ ...faults }),
			}
		);
		return this.handleResponse(response);
	}

	async addRepairDetails(token, serviceId, repairDetails) {
		const response = await fetch(
			`${this.baseURL}/rider/services/${serviceId}/add-repair`,
			{
				method: "POST",
				headers: this.getHeaders(token),
				body: JSON.stringify({ ...repairDetails }),
			}
		);
		return this.handleResponse(response);
	}

	// Verification endpoints
	async verifyBankDetails(token, bankDetails) {
		const response = await fetch(`${this.baseURL}/rider/verify/bank`, {
			method: "POST",
			headers: this.getHeaders(token),
			body: JSON.stringify(bankDetails),
		});
		return this.handleResponse(response);
	}

	async verifyCourtCase(token, courtCase) {
		const response = await fetch(`${this.baseURL}/rider/verify/court`, {
			method: "POST",
			headers: this.getHeaders(token),
			body: JSON.stringify(courtCase),
		});
		return this.handleResponse(response);
	}

	// OTP endpoints

	async sendOTP(token, serviceId) {
		const response = await fetch(
			`${this.baseURL}/rider/services/${serviceId}/send-otp`,
			{
				method: "POST",
				headers: this.getHeaders(token),
			}
		);
		return this.handleResponse(response);
	}

	async verifyOTP(token, serviceId, OTP) {
		const response = await fetch(
			`${this.baseURL}/rider/services/${serviceId}/verify-otp`,
			{
				method: "POST",
				headers: this.getHeaders(token),
				body: JSON.stringify({ OTP }),
			}
		);
		return this.handleResponse(response);
	}
}

export const apiService = new ApiService();
