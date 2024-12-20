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
