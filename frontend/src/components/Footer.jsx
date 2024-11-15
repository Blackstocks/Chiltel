import React from "react";

const Footer = () => {
  return (
    <footer className="py-8 text-black bg-white">
      <div className="container flex flex-wrap justify-between gap-8 px-4 mx-auto md:flex-nowrap md:px-20">
        {/* About Company Section */}
        <div className="w-full mb-8 md:w-1/3 md:mb-0">
          <h3 className="mb-4 text-lg font-semibold">ABOUT COMPANY</h3>
          <p className="mb-5 text-gray-600">
            Chiltel India, founded by Mr. Sudarshan Kuumar Raut in 2021, is a
            recognized startup in the Home Appliances Sales and Service sector,
            earning DIIPT recognition from the Indian government in 2022.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              <img
                src="assets/google.png"
                alt="Google"
                className="w-5 h-5"
              />
            </a>
            <a
              href="#"
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              <img
                src="assets/facebook.png"
                alt="Facebook"
                className="w-5 h-5"
              />
            </a>
            <a
              href="#"
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              <img
                src="assets/instagram.png"
                alt="Instagram"
                className="w-5 h-5"
              />
            </a>
            <a
              href="#"
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              <img
                src="assets/linkedin.png"
                alt="LinkedIn"
                className="w-5 h-5"
              />
            </a>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="w-full mb-8 md:w-1/3 md:mb-0 md:ml-8">
          <h3 className="mb-4 text-lg font-semibold">QUICK LINKS</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-gray-600 hover:text-black">
                Services
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-black">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-black">
                Blog
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center text-gray-600 hover:text-black"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center text-gray-600 hover:text-black"
              >
                Terms & Conditions
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center text-gray-600 hover:text-black"
              >
                <span className="mr-2">&#128101;</span> Partners Sign Up
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center text-gray-600 hover:text-black"
              >
                <span className="mr-2">&#128100;</span> Partners Login
              </a>
            </li>
          </ul>
        </div>

        {/* Search and Contact Section */}
        <div className="w-full md:w-1/3">
          <h3 className="mb-4 text-lg font-semibold">CONTACTS</h3>
          <p className="mb-2 text-gray-600">
            &#127968; Shanti Apartment, Flat No - 1 D/2, Nowbhanga, SEC-IV,
            North 24 Parganas, Kolkata - 700105
          </p>
          <p className="mb-2 text-gray-600">&#128231; info@chiltel.com</p>
          <p className="mb-2 text-gray-600">&#128222; +91 70033 26830</p>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-500">
        <div className="flex flex-col items-center mx-4 space-y-2 md:flex-row justify-evenly md:mx-8 md:space-y-0 md:space-x-4">
          <p className="md:ml-5">
            &copy; 2024 Copyright: Chiltel partnered with DevLaunch. All Rights
            Reserved.
          </p>
          <p className="md:mr-5">Made with Love in India</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
