import React from "react";

export const Alert = ({ children, className = "", variant = "default" }) => {
  const baseStyles = "relative w-full rounded-lg border p-4 mb-4 text-sm";
  const variantStyles = {
    default: "bg-white border-gray-200 text-gray-800",
    error: "bg-red-50 border-red-200 text-red-800",
    success: "bg-green-50 border-green-200 text-green-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  return (
    <div
      role="alert"
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </div>
  );
};

export const AlertTitle = ({ children, className = "" }) => {
  return (
    <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`}>
      {children}
    </h5>
  );
};

export const AlertDescription = ({ children, className = "" }) => {
  return (
    <div className={`text-sm leading-relaxed ${className}`}>
      {children}
    </div>
  );
};