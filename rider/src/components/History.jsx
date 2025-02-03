import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, User, MapPin } from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { formatDate } from "../utils/formatters";

const HistoryTab = () => {
  const { getServiceHistory, loading, error } = useServices();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const response = await getServiceHistory();
      setHistory(response);
    };
    fetchHistory();
  }, []);

  const ServiceCard = ({ service, index }) => (
    <Card className="p-4 mb-3 transition-shadow duration-200 bg-white shadow-sm hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex gap-3">
          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-900">Service #{index + 1}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{service?.service?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 text-sm text-green-600 rounded-full bg-green-50">
            Completed
          </span>
          <div className="text-sm text-gray-500">
            {formatDate(service.completedAt)}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* User Info */}
        <div className="flex gap-3">
          <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full bg-blue-50">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Customer</p>
            <p className="text-sm font-medium text-gray-900">{service.user.name}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex gap-3">
          <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full bg-green-50">
            <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Customer Rating</p>
            <p className="text-sm font-medium text-gray-900">Rating: 5.0</p>
          </div>
        </div>

        {/* Location - Full Width */}
        <div className="col-span-2">
          <div className="flex gap-2">
            <MapPin className="flex-shrink-0 w-4 h-4 mt-1 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Service Location</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5">
                {service.userLocation.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px] text-sm text-gray-500">
        Loading services...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[400px] text-sm text-gray-500">
        Error loading services
      </div>
    );
  }

  if (history.services?.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-sm text-gray-500">
        No completed service available
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-180px)]">
      <div className="px-4 py-2">
        {history && history.services?.map((service, index) => (
          <ServiceCard key={service._id} service={service} index={index} />
        ))}
      </div>
    </ScrollArea>
  );
};

export default HistoryTab;