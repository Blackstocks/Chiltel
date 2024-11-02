import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col justify-around gap-12 py-20 text-xs text-center text-gray-700 sm:flex-row sm:gap-2 sm:text-sm md:text-base'>
      
      <div>
        <img src={assets.exchange_icon} className='w-12 m-auto mb-5' alt="" />
        <p className='font-semibold '>Price Never Seen</p>
        <p className='text-gray-400 '>Prices So Low, You Won't Believe Your Eyes</p>
      </div>
      <div>
        <img src={assets.quality_icon} className='w-12 m-auto mb-5' alt="" />
        <p className='font-semibold '>No Service No Fee</p>
        <p className='text-gray-400 '>Service You Can Trust, or It’s Free</p>
      </div>
      <div>
        <img src={assets.support_img} className='w-12 m-auto mb-5' alt="" />
        <p className='font-semibold '>Best customer support</p>
        <p className='text-gray-400 '>we provide 24/7 customer support</p>
      </div>

    </div>
  )
}

export default OurPolicy
