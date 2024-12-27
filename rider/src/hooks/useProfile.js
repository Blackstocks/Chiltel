import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiService } from "../services/api.service";
import { toast } from "react-toastify";

export const useProfile = () => {
	const { state } = useAuth();
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let mounted = true;

		const fetchProfile = async () => {
			try {
				const data = await apiService.getProfile(state.token);
				console.log(data);
				if (mounted) {
					setProfile(data);
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
			fetchProfile();
		}

		return () => {
			mounted = false;
		};
	}, [state.token]);

	const updateProfile = async (profileData) => {
		try {
			const updatedProfile = await apiService.updateProfile(
				state.token,
				profileData
			);
			setProfile(updatedProfile);
			toast.success("Profile updated successfully");
			return updatedProfile;
		} catch (err) {
			setError(err.message);
			toast.error("Error updating profile");
			throw err;
		}
	};

	return { profile, loading, error, updateProfile };
};
