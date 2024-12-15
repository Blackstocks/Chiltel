import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import NewsletterBox from "../components/NewsletterBox";

const images = [
  "/assets/aboutus.png",
  "/assets/aboutus2.png",
  "/assets/aboutus3.png"
];

const About = () => {
  const [currentImage, setCurrentImage] = useState(images[0]);
  const [fade, setFade] = useState(true); // State to handle fading

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Start fading out
      setTimeout(() => {
        setCurrentImage((prevImage) => {
          const currentIndex = images.indexOf(prevImage);
          return images[(currentIndex + 1) % images.length];
        });
        setFade(true); // Start fading in
      }, 500); // Adjust to match fade-out duration
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="px-4 md:px-8 lg:px-16">
      <div className="pt-8 text-2xl text-center border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>

      <div className="flex flex-col gap-12 my-10 md:flex-row">
        <div className={`relative w-full md:max-w-[450px] transition-opacity duration-700 ${fade ? 'opacity-100' : 'opacity-0'}`}>
          <img
            src={currentImage}
            alt="About Us"
            className="object-cover w-full h-192" // Increased height to h-160 (40rem)
          />
        </div>
        <div className="flex flex-col justify-center gap-6 text-gray-600 md:w-2/4">
          <p className="mb-4">
            Chiltel India, established in 2021 by Mr. Sudarshan Kuumar Raut, is a
            distinguished startup in the Sales and Service sector of Domestic
            and Commercial Home Appliances Industries. Recognized as a Startup by
            the Department of Industrial Policy and Promotion (DIIPT) of the
            Government of India in 2022, we have become a reputable force in the
            market.
          </p>
          <p className="mb-4">
            Operating both through offline and online on-demand platforms,
            Chiltel India is dedicated to providing comprehensive solutions to
            its clients. Our team comprises trained and experienced
            professionals specializing in both Domestic and Commercial
            Refrigeration Industries. We aim to offer top-notch services to our
            clients.
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>
          At Chiltel India, our vision is centered on delivering
            premium services to customers at affordable rates, all within the
            convenience of their doorstep. Specializing in a range of products,
            including Deep Freezers, Visi-Coolers, Chest Freezers, Back Bar
            Freezers, Under Counters, Horizontal Steel Freezers & Chillers, and
            Domestic Freezers & ACs, we cater to the diverse needs of our
            clientele in the Eastern region.
          </p>
        </div>
      </div>

      <div className="py-4 text-xl ">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>

      <div className="flex flex-col mb-20 text-sm md:flex-row">
        <div className="flex flex-col gap-5 px-10 py-8 border md:px-16 sm:py-10">
          <b>Quality Assurance:</b>
          <p className="text-gray-600 ">
            We meticulously select and vet each product to ensure it meets our
            stringent quality standards.
          </p>
        </div>
        <div className="flex flex-col gap-5 px-10 py-8 border md:px-16 sm:py-10">
          <b>Convenience:</b>
          <p className="text-gray-600 ">
            With our user-friendly interface and hassle-free ordering process,
            shopping has never been easier.
          </p>
        </div>
        <div className="flex flex-col gap-5 px-10 py-8 border md:px-16 sm:py-10">
          <b>Exceptional Customer Service:</b>
          <p className="text-gray-600 ">
            Our team of dedicated professionals is here to assist you, ensuring
            your satisfaction is our top priority.
          </p>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default About;
