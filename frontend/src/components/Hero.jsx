import React, { useState, useEffect } from 'react';

const AnimatedCounter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      setCount(Math.floor(end * percentage));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return count;
};

const TypewriterText = () => {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullText = 'Expert Appliance\nSolutions at Your Doorstep';
  const typingSpeed = 100;
  const erasingSpeed = 30;
  const delayBeforeErasing = 2000;

  useEffect(() => {
    let timeout;

    if (isTyping) {
      if (text !== fullText) {
        timeout = setTimeout(() => {
          setText(fullText.slice(0, text.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, delayBeforeErasing);
      }
    } else {
      if (text) {
        timeout = setTimeout(() => {
          setText(text.slice(0, -1));
        }, erasingSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(true);
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isTyping]);

  return (
    <div className="relative mb-2 sm:mb-3 md:mb-4">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold text-gray-900 whitespace-pre-line leading-tight min-h-[3em] sm:min-h-[2.75em] md:min-h-[3em]">
        {text}
        <span 
          className="inline-block w-0.5 h-[1em] ml-[2px] -mb-1 bg-gray-900 animate-pulse" 
          style={{ verticalAlign: 'baseline' }} 
        />
      </h1>
    </div>
  );
};

const Hero = () => {
  const categories = [
    {
      name: 'Air Conditioner',
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    },
    {
      name: 'Water Purifier',
      icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
    },
    {
      name: 'Geyser',
      icon: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
    },
    {
      name: 'Microwave',
      icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
    },
    {
      name: 'Installation',
      icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
    },
    {
      name: 'Repair & Service',
      icon: "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
    }
  ];

  const stats = [
    {
      end: 15,
      text: 'Years Experience',
      color: 'blue',
      icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
    },
    {
      end: 1500,
      text: 'Happy Customers',
      color: 'green',
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    },
    {
      end: 30,
      text: 'Expert Technicians',
      color: 'purple',
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    }
  ];

  return (
    <div className="container px-4 mx-auto max-w-7xl">
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-20">
        {/* Left Column - Text Content */}
        <div className="flex flex-col justify-center order-2 py-4 space-y-4 lg:order-1 sm:py-6 md:py-8 lg:py-12 sm:space-y-5 md:space-y-6">
          <div>
            <TypewriterText />
            <p className="overflow-hidden text-sm text-gray-600 whitespace-normal sm:text-base md:text-lg lg:text-lg sm:whitespace-nowrap">
              Professional appliance solutions and services with certified technicians
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg shadow-sm sm:text-base sm:px-4 sm:py-3 md:px-6 md:py-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute px-3 py-1.5 text-sm sm:text-base text-white transform -translate-y-1/2 bg-blue-600 rounded-md sm:px-3 sm:py-1.5 md:px-6 md:py-2 right-2 top-1/2 hover:bg-blue-700 transition-colors">
              Search
            </button>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            {categories.map(({ name, icon }) => (
              <div 
                key={name} 
                className="p-2.5 transition-shadow bg-white border border-gray-100 rounded-lg shadow-sm cursor-pointer sm:p-3 md:p-4 hover:shadow-md"
              >
                <div className="flex items-center gap-2 sm:gap-2 md:gap-3">
                  <div className="p-1.5 sm:p-1.5 md:p-2 rounded-lg bg-blue-50">
                    <svg 
                      className="w-4 h-4 text-blue-600 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d={icon} 
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-800 sm:text-base md:text-lg">
                    {name}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 pt-2 sm:gap-3 md:gap-4 lg:gap-6 sm:pt-4">
            {stats.map(({ end, text, color, icon }) => (
              <div key={text} className="flex items-start gap-1.5 sm:gap-1.5 md:gap-2">
                <div className={`p-1.5 sm:p-1.5 md:p-2 rounded-lg bg-${color}-50`}>
                  <svg 
                    className={`w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-6 lg:h-6 text-${color}-600`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d={icon} 
                    />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="text-base font-bold text-gray-900 sm:text-lg md:text-xl lg:text-2xl">
                      <AnimatedCounter end={end} duration={1500} />
                    </span>
                    <span className="text-base font-bold text-gray-900 sm:text-base md:text-lg lg:text-xl">+</span>
                  </div>
                  <span className="text-xs text-gray-600 sm:text-sm md:text-base">{text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="relative order-1 w-full lg:order-2">
          <div className="w-full h-56 overflow-hidden rounded-lg sm:h-64 md:h-80 lg:h-full">
            <img
              src="/src/assets/home.png"
              alt="Home Appliance Professional"
              className="object-cover w-full h-full lg:object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;