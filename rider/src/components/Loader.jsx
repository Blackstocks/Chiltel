import React from "react";

const Loader = ({ size = "medium", color = "blue" }) => {
	// Map size to Tailwind classes
	const sizeClasses = {
		small: "w-4 h-4",
		medium: "w-8 h-8",
		large: "w-12 h-12",
	};

	// Map color to Tailwind classes
	const colorClasses = {
		blue: "border-blue-500",
		red: "border-red-500",
		green: "border-green-500",
		purple: "border-purple-500",
	};

	return (
		<div className="flex items-center justify-center">
			<div
				className={`
          ${sizeClasses[size] || sizeClasses.medium}
          ${colorClasses[color] || colorClasses.blue}
          border-4 
          border-t-transparent 
          rounded-full 
          animate-spin
        `}
				role="status"
				aria-label="loading"
			/>
		</div>
	);
};

export default Loader;
