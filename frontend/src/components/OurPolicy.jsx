import React from 'react'
import { assets } from '../assets/assets'
import { MdOutlineSavings, MdOutlineVerifiedUser } from "react-icons/md";
import { RiCustomerService2Line } from "react-icons/ri";

const OurPolicy = () => {
  return (
    <div className='flex flex-col justify-around gap-12 py-20 text-xs text-center text-gray-700 sm:flex-row sm:gap-2 sm:text-sm md:text-base'>
      
      <div>
        {/* <img src={assets.exchange_icon} className='w-12 m-auto mb-5' alt="" /> */}
        <MdOutlineSavings style={{ fontSize: '48px', fontWeight: '700' }} className='w-12 m-auto mb-5 text-gray-800 font-bold' />
        <p className='font-semibold '>Price Never Seen</p>
        <p className='text-gray-400 '>Affordable Pricing for Every Need - <br/>Products and Services You Can Trust!</p>
      </div>
      <div>
        {/* <img src={assets.quality_icon} className='w-12 m-auto mb-5' alt="" /> */}
        <MdOutlineVerifiedUser style={{ fontSize: '48px', fontWeight: '700' }} className='w-12 m-auto mb-5 text-gray-800 font-bold' />
        <p className='font-semibold '>No Service No Fee</p>
        <p className='text-gray-400 '>30-Day Warranty with Genuine <br/>
        Manufacturer Spares for All Services!</p>
      </div>
      <div>
        {/* <img src={assets.support_img} className='w-12 m-auto mb-5' alt="" /> */}
        <RiCustomerService2Line style={{ fontSize: '48px', fontWeight: '700' }} className='w-12 m-auto mb-5 text-gray-800 font-bold' />
        <p className='font-semibold '>Best customer support</p>
        <p className='text-gray-400 '>We provide customer support from <br/> 9 AM to 6 PM, Monday to Saturday</p>
      </div>

    </div>
  )
}

export default OurPolicy
