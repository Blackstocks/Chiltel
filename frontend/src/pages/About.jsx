import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import NewsletterBox from "../components/NewsletterBox";

const images = [
  "/assets/aboutus.png",
  "/assets/aboutus2.png",
  "/assets/aboutus3.png",
];

const About = () => {
  const [currentImage, setCurrentImage] = useState(images[0]);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImage((prevImage) => {
          const currentIndex = images.indexOf(prevImage);
          return images[(currentIndex + 1) % images.length];
        });
        setFade(true);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-4 md:px-8 lg:px-16">
      <div className="pt-8 text-2xl text-center border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>

      <div className="flex flex-col gap-12 my-10 md:flex-row">
        <div
          className={`relative w-full md:max-w-[450px] transition-opacity duration-700 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={currentImage}
            alt="About Us"
            className="object-cover w-full h-192"
          />
        </div>
        <div className="flex flex-col justify-center gap-6 text-gray-600 md:w-2/4">
          <p className="mb-4">
            Chiltel India, established in 2021 by Mr. Sudarshan Kuumar Raut, is
            a distinguished startup in the Sales and Service sector of Domestic
            and Commercial Home Appliances Industries. Recognized as a Startup
            by the Department of Industrial Policy and Promotion (DIIPT) of the
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
            At Chiltel India, our vision is centered on delivering premium
            services to customers at affordable rates, all within the
            convenience of their doorstep. Specializing in a range of products,
            including Deep Freezers, Visi-Coolers, Chest Freezers, Back Bar
            Freezers, Under Counters, Horizontal Steel Freezers & Chillers, and
            Domestic Freezers & ACs, we cater to the diverse needs of our
            clientele in the Eastern region.
          </p>
        </div>
      </div>

      <div className="py-4 text-xl">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>

      {/* Grid container for all boxes */}
      <div className="grid grid-cols-1 gap-6 mb-20 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col h-full p-6 transition-shadow border rounded-lg hover:shadow-lg">
          <b className="mb-3 text-lg">Quality Assurance</b>
          <p className="text-gray-600">
            We carefully select and vet each product to meet high quality
            standards, ensuring the best for you.
          </p>
        </div>

        <div className="flex flex-col h-full p-6 transition-shadow border rounded-lg hover:shadow-lg">
          <b className="mb-3 text-lg">Convenience</b>
          <p className="text-gray-600">
            Enjoy a seamless shopping experience with our easy-to-use interface
            and hassle-free ordering process.
          </p>
        </div>

        <div className="flex flex-col h-full p-6 transition-shadow border rounded-lg hover:shadow-lg">
          <b className="mb-3 text-lg">Exceptional Customer Service</b>
          <p className="text-gray-600">
            Our dedicated team is here to assist you, ensuring your satisfaction
            every step of the way.
          </p>
        </div>

        <div className="flex flex-col h-full p-6 transition-shadow border rounded-lg hover:shadow-lg">
          <b className="mb-3 text-lg">Your Trusted Partner</b>
          <p className="text-gray-600">
            We are committed to excellence in every interaction, delivering
            high-quality service as your trusted partner.
          </p>
        </div>

        <div className="flex flex-col h-full p-6 transition-shadow border rounded-lg hover:shadow-lg">
          <b className="mb-3 text-lg">Authorized Expertise</b>
          <p className="text-gray-600">
            As authorized dealers and service experts, we offer certified
            quality and professional service for leading brands.
          </p>
        </div>

        <div className="flex flex-col h-full p-6 transition-shadow border rounded-lg hover:shadow-lg">
          <b className="mb-3 text-lg">Comprehensive Solutions</b>
          <p className="text-gray-600">
            We provide trusted sales and service solutions, supporting top
            brands like Rockwell, Western Refrigeration, Daikin, Haier, and
            more.
          </p>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default About;
