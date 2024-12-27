export const formatCurrency = (amount) => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(amount);
};

export const formatDate = (date) => {
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(date));
};

export const formatDistance = (meters) => {
	if (meters < 1000) {
		return `${Math.round(meters)}m`;
	}
	return `${(meters / 1000).toFixed(1)}km`;
};

export const getTimeDiffString = (date) => {
	const diff = new Date() - new Date(date);
	const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
	const days = Math.floor((diff / (1000 * 60 * 60 * 24)) % 30);
	const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
	const minutes = Math.floor((diff / (1000 * 60)) % 60);

	if (months > 0) {
		return `${months} ${months === 1 ? "month" : "months"} and ${days} ${
			days === 1 ? "day" : "days"
		}`;
	} else if (days > 0) {
		return `${days} ${days === 1 ? "day" : "days"} and ${hours}  ${
			hours === 1 ? "hour" : "hours"
		}`;
	} else if (hours > 0) {
		return `${hours} ${hours === 1 ? "hour" : "hours"} and ${minutes} ${
			minutes === 1 ? "minute" : "minutes"
		}`;
	} else {
		return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
	}
};
