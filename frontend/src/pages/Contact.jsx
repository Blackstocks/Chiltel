import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';
import { FaPhone, FaEnvelope, FaHome } from 'react-icons/fa';
import QueryForm from '../components/QueryForm';
import Map from '../components/Map';

const Contact = () => {
  return (
    <div className="container px-4 mx-auto sm:px-6 lg:px-8">
      <div className="py-8 border-t sm:py-12">
        <div className="text-2xl text-center sm:text-3xl lg:text-4xl">
          <Title text1={'CONTACT'} text2={'US'} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 my-8 md:grid-cols-2 lg:gap-12 sm:my-12">
        <div className="flex items-center justify-center w-full">
          <img 
            className="object-cover w-full h-auto max-w-lg rounded-lg shadow-md" 
            src="/assets/ContactUs.png" 
            alt="Contact Us" 
          />
        </div>

        <div className="px-4 space-y-6 sm:px-6">
          <h2 className="text-xl font-semibold text-gray-600 sm:text-2xl">
            Our Store
          </h2>
          
          <div className="flex items-start space-x-3 text-gray-500">
            <FaHome className="flex-shrink-0 mt-1" />
            <p className="text-sm sm:text-base">
              Address: Shristi Apartment, Flat No - 1 D/2, Nowbhanga,
              {' '}SEC-IV, North 24 Parganas, Kolkata - 700105
            </p>
          </div>

          <div className="space-y-3 text-gray-500">
            <div className="flex items-center space-x-3">
              <FaPhone className="transform -scale-x-100" />
              <span className="text-sm sm:text-base">Tel: +91 70033 26830</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <FaEnvelope />
              <span className="text-sm sm:text-base">Email: info@chiltel.com</span>
            </div>
          </div>

          <div className="w-full">
            <QueryForm />
          </div>
        </div>
      </div>

      <div className="my-8 sm:my-12">
        <Map />
      </div>

      <div className="mb-8 sm:mb-12">
        <NewsletterBox />
      </div>
    </div>
  );
};

export default Contact;