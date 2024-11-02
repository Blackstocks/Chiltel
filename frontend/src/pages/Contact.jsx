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
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-500 flex items-start'>
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
