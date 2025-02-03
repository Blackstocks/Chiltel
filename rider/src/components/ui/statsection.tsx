import React from 'react';
import { Briefcase, Star, Calendar, Info } from 'lucide-react';

const StatsSection = ({ profileData }) => {
  const StatCard = ({ title, value, icon: Icon }) => (
    <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-medium text-blue-500">{title}</h3>
        <Icon className="w-4 h-4 text-blue-500" />
      </div>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  );

  return (
    <div className="px-4 py-2">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard 
          title="Completed Services" 
          value={profileData.services.completed}
          icon={Briefcase}
        />
        <StatCard 
          title="Rating" 
          value={`${profileData.rating.average.toFixed(1)} ★`}
          icon={Star}
        />
        <StatCard 
          title="Total Services" 
          value={profileData.services.total}
          icon={Calendar}
        />
        <StatCard 
          title="Balance" 
          value={`₹${profileData.balance.toFixed(0)}`}
          icon={Info}
        />
      </div>
    </div>
  );
};

export default StatsSection;