import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';
import { FaPhone, FaEnvelope, FaHome } from 'react-icons/fa';
import QueryForm from '../components/QueryForm';
import Map from '../components/Map';

const Contact = () => {
  return (
    <div>
      <div className='pt-10 text-2xl text-center border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='flex flex-col justify-center gap-10 my-10 md:flex-row mb-28'>
        <img className='w-full md:max-w-[480px]' src="\src\assets\ContactUs.png" alt="" />
        <div className='flex flex-col items-start justify-center gap-6'>
          <p className='text-xl font-semibold text-gray-600'>Our Store</p>
          <p className='flex items-start text-gray-500'>
            <FaHome className='inline-block mr-2' />
            <span>
              Address: Shanti Apartment, Flat No - 1 D/2, Nowbhanga,
              <span className='hidden lg:inline'> </span>
              <br className='block lg:hidden' />
              SEC-IV, North 24 Parganas, Kolkata - 700105
            </span>
          </p>
          <p className='text-gray-500'>
            <FaPhone className='inline-block mr-2' style={{ transform: 'scaleX(-1)' }} />
            Tel: +91 70033 26830 <br />
            <FaEnvelope className='inline-block mr-2' />
            Email: info@chiltel.com
          </p>
          <QueryForm />
        </div>
      </div>

      <Map />

      <NewsletterBox />
    </div>
  );
};

export default Contact;
