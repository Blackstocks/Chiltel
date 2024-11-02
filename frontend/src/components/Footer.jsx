import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white text-black py-8">
      <div className="container mx-auto flex flex-wrap md:flex-nowrap justify-between px-4 md:px-20 gap-8">
        {/* About Company Section */}
        <div className="w-full md:w-1/3 mb-8 md:mb-0">
          <h3 className="text-lg font-semibold mb-4">ABOUT COMPANY</h3>
          <p className="text-gray-600 mb-5">
            Chiltel India, founded by Mr. Sudarshan Kuumar Raut in 2021, is a
            recognized startup in the Home Appliances Sales and Service sector,
            earning DIIPT recognition from the Indian government in 2022.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
            >
              <img
                src="src/assets/google.png"
                alt="Google"
                className="w-5 h-5"
              />
            </a>
            <a
              href="#"
              className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
            >
              <img
                src="src/assets/facebook.png"
                alt="Facebook"
                className="w-5 h-5"
              />
            </a>
            <a
              href="#"
              className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
            >
              <img
                src="src/assets/instagram.png"
                alt="Instagram"
                className="w-5 h-5"
              />
            </a>
            <a
              href="#"
              className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
            >
              <img
                src="src/assets/linkedin.png"
                alt="LinkedIn"
                className="w-5 h-5"
              />
            </a>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="w-full md:w-1/3 mb-8 md:mb-0 md:ml-8">
          <h3 className="text-lg font-semibold mb-4">QUICK LINKS</h3>
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
                className="text-gray-600 hover:text-black flex items-center"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-600 hover:text-black flex items-center"
              >
                Terms & Conditions
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-600 hover:text-black flex items-center"
              >
                <span className="mr-2">&#128101;</span> Partners Sign Up
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-600 hover:text-black flex items-center"
              >
                <span className="mr-2">&#128100;</span> Partners Login
              </a>
            </li>
          </ul>
        </div>

        {/* Search and Contact Section */}
        <div className="w-full md:w-1/3">
          <h3 className="text-lg font-semibold mb-4">CONTACTS</h3>
          <p className="text-gray-600 mb-2">
            &#127968; Shanti Apartment, Flat No - 1 D/2, Nowbhanga, SEC-IV,
            North 24 Parganas, Kolkata - 700105
          </p>
          <p className="text-gray-600 mb-2">&#128231; info@chiltel.com</p>
          <p className="text-gray-600 mb-2">&#128222; +91 70033 26830</p>
        </div>
      </div>
      <div className="text-center mt-8 text-gray-500">
        <div className="flex flex-col md:flex-row justify-evenly items-center mx-4 md:mx-8 space-y-2 md:space-y-0 md:space-x-4">
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
