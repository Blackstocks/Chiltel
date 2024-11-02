import React from 'react';

const Map = () => {
  return (
    <div className='mt-10'>
      <h2 className='text-2xl font-semibold mb-4'>Our Location</h2>
      <div className='w-full h-96'>
        <iframe
          title='Kolkata Map with Exact Location'
          src='https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14710.XXXXXXX!2d88.XXXXXX!3d22.XXXXXX!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f8XXXXXXX:0xXXXXXXXXXXXXXX!2sYour%20Location%20Name,%20Kolkata!5e0!3m2!1sen!2sin!4vXXXXXXXXXXX&markers=22.XXXXXX,88.XXXXXX'
          width='100%'
          height='100%'
          style={{ border: 0 }}
          allowFullScreen=''
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'
        ></iframe>
      </div>
    </div>
  );
};

export default Map;
