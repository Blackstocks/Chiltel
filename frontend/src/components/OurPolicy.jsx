import React from "react";
import { Sparkles, ShieldCheck, Clock } from "lucide-react";

const OurPolicy = () => {
  const policies = [
    {
      icon: <Sparkles className="w-8 h-8 text-white stroke-2" aria-label="Sparkles Icon" />,
      title: "Price Never Seen",
      description: "Affordable Pricing for Every Need - Products and Services You Can Trust!",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-white stroke-2" aria-label="Shield Check Icon" />,
      title: "No Service No Fee",
      description: "30-Day Warranty with Genuine Manufacturer Spares for All Services!",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Clock className="w-8 h-8 text-white stroke-2" aria-label="Clock Icon" />,
      title: "Best Customer Support",
      description: "We provide customer support from 9 AM to 6 PM, Monday to Saturday.",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="flex flex-col justify-around gap-12 py-20 text-xs text-center text-gray-700 sm:flex-row sm:gap-2 sm:text-sm md:text-base">
      {policies.map((policy, index) => (
        <section key={index} className="flex flex-col items-center">
          <div className="relative animate-bounce">
            <div
              className={`flex items-center justify-center w-16 h-16 m-auto mb-5 rounded-full bg-gradient-to-r ${policy.gradient}`}
            >
              {policy.icon}
            </div>
          </div>
          <p className="font-semibold">{policy.title}</p>
          <p className="text-gray-400">{policy.description}</p>
        </section>
      ))}
    </div>
  );
};

export default OurPolicy;
