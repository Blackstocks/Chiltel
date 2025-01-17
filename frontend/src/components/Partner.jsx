import React from "react";

const Partner = () => {
  const partnerLogos = [
    { name: "Samsung", src: "/assets/samsung.svg" },
    { name: "Daikin", src: "/assets/daikin.svg" },
    { name: "Blue Star", src: "/assets/bluestar.svg" },
    { name: "Godrej", src: "/assets/godrej.svg" },
    { name: "Electrolux", src: "/assets/electrolux.svg" },
    { name: "Haier", src: "/assets/haier.svg" },
    { name: "Panasonic", src: "/assets/panasonic.svg" },
    { name: "Voltas", src: "/assets/voltas.jpg" },
    { name: "Whirlpool", src: "/assets/whirlpool.svg" },
    { name: "LG", src: "/assets/lg.svg" },
    { name: "Carrier", src: "/assets/carrier.svg" },
  ];

  return (
    <div className="my-10 text-center">
      <style>
        {`
          .marquee {
            overflow: hidden;
            white-space: nowrap;
            width: 100%;
            display: flex;
            justify-content: center;
          }

          .marquee-content {
            display: flex;
            animation: scroll-right 15s linear infinite;
          }

          .marquee-content-reverse {
            display: flex;
            animation: scroll-left 15s linear infinite;
          }

          @keyframes scroll-right {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }

          @keyframes scroll-left {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }

          .logo-image {
            width: 100px; /* Adjust for responsiveness */
            height: auto; /* Maintain aspect ratio */
            margin: 0 15px; /* Spacing between images */
            object-fit: contain;
          }

          .lower-marquee {
            margin-top: 1rem; /* Spacing between the two marquees */
          }

          @media (min-width: 768px) {
            .logo-image {
              width: 120px; /* Larger logos for bigger screens */
            }
          }
        `}
      </style>

      <div className="py-8 text-3xl text-center">
        <h2 className="text-3xl">
          <span className="text-gray-500">PART</span>
          <span className="text-gray-900">NERS</span>
        </h2>
        <p className="w-3/4 m-auto text-xs text-gray-600 sm:text-sm md:text-base">
          Together with our Partners, Delivering Excellence.
        </p>
      </div>

      {/* Upper row - scrolling from right to left */}
      <div className="marquee">
        <div className="marquee-content">
          {/* Duplicate the logos for seamless scrolling */}
          {[...partnerLogos, ...partnerLogos].map((logo, index) => (
            <img
              key={`upper-${index}`}
              src={logo.src}
              alt={`${logo.name} logo`}
              className="inline-block logo-image"
              aria-label={logo.name}
            />
          ))}
        </div>
      </div>

      {/* Lower row - scrolling from left to right */}
      <div className="lower-marquee marquee">
        <div className="marquee-content-reverse">
          {/* Duplicate the logos for seamless scrolling */}
          {[...partnerLogos, ...partnerLogos].map((logo, index) => (
            <img
              key={`lower-${index}`}
              src={logo.src}
              alt={`${logo.name} logo`}
              className="inline-block logo-image"
              aria-label={logo.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Partner;
