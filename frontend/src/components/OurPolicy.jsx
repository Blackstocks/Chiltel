import React from 'react';
import { Sparkles, ShieldCheck, Clock } from 'lucide-react';

const OurPolicy = () => {
  return (
    <div className='flex flex-col justify-around gap-12 py-20 text-xs text-center text-gray-700 sm:flex-row sm:gap-2 sm:text-sm md:text-base'>
      
      <div>
        <div className="relative animate-bounce">
          <div className="flex items-center justify-center w-16 h-16 m-auto mb-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
            <Sparkles className="w-8 h-8 text-white stroke-2" />
          </div>
        </div>
        <p className='font-semibold'>Price Never Seen</p>
        <p className='text-gray-400'>Affordable Pricing for Every Need - <br/>Products and Services You Can Trust!</p>
      </div>

      <div>
        <div className="relative animate-bounce">
          <div className="flex items-center justify-center w-16 h-16 m-auto mb-5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
            <ShieldCheck className="w-8 h-8 text-white stroke-2" />
          </div>
        </div>
        <p className='font-semibold'>No Service No Fee</p>
        <p className='text-gray-400'>30-Day Warranty with Genuine <br/>
        Manufacturer Spares for All Services!</p>
      </div>

      <div>
        <div className="relative animate-bounce">
          <div className="flex items-center justify-center w-16 h-16 m-auto mb-5 rounded-full bg-gradient-to-r from-orange-500 to-red-500">
            <Clock className="w-8 h-8 text-white stroke-2" />
          </div>
        </div>
        <p className='font-semibold'>Best customer support</p>
        <p className='text-gray-400'>We provide customer support from <br/> 9 AM to 6 PM, Monday to Saturday</p>
      </div>

    </div>
  )
}

export default OurPolicy;