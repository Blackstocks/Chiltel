import React from 'react';

const QueryForm = () => {
  return (
    <div className='mt-10'>
      <h2 className='text-2xl font-semibold mb-6'>Raise A Query</h2>
      <form className='space-y-4'>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex-1'>
            <label className='block mb-2 font-medium'>Name*</label>
            <input
              type='text'
              placeholder='Enter Your Name'
              className='w-full border border-teal-500 p-2'
              required
            />
          </div>
          <div className='flex-1'>
            <label className='block mb-2 font-medium'>Email*</label>
            <input
              type='email'
              placeholder='Enter Your Email id'
              className='w-full border border-teal-500 p-2'
              required
            />
          </div>
          <div className='flex-1'>
            <label className='block mb-2 font-medium'>Phone Number*</label>
            <input
              type='tel'
              placeholder='Enter Your Mobile No'
              className='w-full border border-teal-500 p-2'
              required
            />
          </div>
        </div>

        <div>
          <label className='block mb-2 font-medium'>Subject *</label>
          <input
            type='text'
            placeholder='Write about your query'
            className='w-full border border-teal-500 p-2'
            required
          />
        </div>

        <div>
          <label className='block mb-2 font-medium'>Your Message</label>
          <textarea
            placeholder='Write Your Message'
            className='w-full border border-teal-500 p-2 h-28'
            required
          ></textarea>
        </div>

        <button type='submit' className='bg-gray-800 text-white px-6 py-2 mt-4 hover:bg-gray-700'>
          Send
        </button>
      </form>
    </div>
  );
};

export default QueryForm;
