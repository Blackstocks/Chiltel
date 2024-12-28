import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import Link from 'next/link';

const Footer = () => {
  const TermsContent = () => (
    <div className="text-sm space-y-6 max-h-[70vh] overflow-y-auto p-4">
      {/* <h2 className="mb-4 text-lg font-semibold">Terms & Conditions</h2> */}
      <div className="space-y-4">
        <p>
          The Website Owner, including subsidiaries and affiliates (“Website” or
          “Website Owner” or “we” or “us” or “our”) provides the information
          contained on the website or any of the pages comprising the website
          (“website”) to visitors (“visitors”) (cumulatively referred to as
          “you” or “your” hereinafter) subject to the terms and conditions set
          out in these website terms and conditions, the privacy policy and any
          other relevant terms and conditions, policies and notices which may be
          applicable to a specific section or module of the website.
        </p>
        <p>
          Welcome to our website. If you continue to browse and use this website
          you are agreeing to comply with and be bound by the following terms
          and conditions of use, which together with our privacy policy govern
          CHILTEL INDIA PRIVATE LIMITED''s relationship with you in relation to
          this website.
        </p>
        <p>
          The term 'CHILTEL INDIA PRIVATE LIMITED' or 'us' or 'we' refers to the
          owner of the website whose registered/operational office is D/2, FLAT
          NO. 1, GROUND FLOOR, NOWBHANGA, SALT LAKE, SECTOR 4, BIDHANNAGAR, P.O-
          NOWBHANGA, P.S- BIDHANNAGAR SOUTH, Pin code- 700105 North
          ParganasKOLKATA WEST BENGAL 700105. The term 'you' refers to the user
          or viewer of our website.
        </p>

        <div className="space-y-2">
          <p className="text-base">
            The use of this website is subject to the following terms of use:
          </p>
          <ul className="pl-6 space-y-2 list-disc">
            <li>
              The content of the pages of this website is for your general
              information and use only. It is subject to change without notice.
            </li>
            <li>
              Neither we nor any third parties provide any warranty or guarantee
              as to the accuracy, timeliness, performance, completeness or
              suitability of the information and materials found or offered on
              this website for any particular purpose. You acknowledge that such
              information and materials may contain inaccuracies or errors and
              we expressly exclude liability for any such inaccuracies or errors
              to the fullest extent permitted by law.
            </li>
            <li>
              Your use of any information or materials on this website is
              entirely at your own risk, for which we shall not be liable. It
              shall be your own responsibility to ensure that any products,
              services or information available through this website meet your
              specific requirements.
            </li>
            <li>
              This website contains material which is owned by or licensed to
              us. This material includes, but is not limited to, the design,
              layout, look, appearance and graphics. Reproduction is prohibited
              other than in accordance with the copyright notice, which forms
              part of these terms and conditions.
            </li>
            <li>
              All trademarks reproduced in this website which are not the
              property of, or licensed to, the operator are acknowledged on the
              website.
            </li>
            <li>
              Unauthorized use of this website may give rise to a claim for
              damages and/or be a criminal offense.
            </li>
            <li>
              From time to time this website may also include links to other
              websites. These links are provided for your convenience to provide
              further information.
            </li>
            <li>
              You may not create a link to this website from another website or
              document without CHILTEL INDIA PRIVATE LIMITED’s prior written
              consent.
            </li>
            <li>
              Your use of this website and any dispute arising out of such use
              of the website is subject to the laws of India or other regulatory
              authority.
            </li>
            <li>
              We as a merchant shall be under no liability whatsoever in respect
              of any loss or damage arising directly or indirectly out of the
              decline of authorization for any Transaction, on account of the
              Cardholder having exceeded the preset limit mutually agreed by us
              with our acquiring bank from time to time.
            </li>
          </ul>
        </div>
        <p className="text-xl">Cookies</p>
        <ul className="pl-6 space-y-2 list-disc">
          <li>
            If you leave a comment on our site you may opt-in to saving your
            name, email address and website in cookies. These are for your
            convenience so that you do not have to fill in your details again
            when you leave another comment. These cookies will last for one
            year.
          </li>
          <li>
            If you have an account and you log in to this site, we will set a
            temporary cookie to determine if your browser accepts cookies. This
            cookie contains no personal data and is discarded when you close
            your browser.
          </li>
          <li>
            When you log in, we will also set up several cookies to save your
            login information and your screen display choices. Login cookies
            last for two days, and screen options cookies last for a year. If
            you select “Remember Me”, your login will persist for two weeks. If
            you log out of your account, the login cookies will be removed.
          </li>
          <li>
            If you edit or publish an article, an additional cookie will be
            saved in your browser. This cookie includes no personal data and
            simply indicates the post ID of the article you just edited. It
            expires after 1 day.
          </li>
        </ul>
        <p className="text-xl">Embedded content from other websites</p>
        <ul className="pl-6 space-y-2 list-disc">
          <li>
            Articles on this site may include embedded content (e.g. videos,
            images, articles, etc.). Embedded content from other websites
            behaves in the exact same way as if the visitor has visited the
            other website.
          </li>
          <li>
            These websites may collect data about you, use cookies, embed
            additional third-party tracking, and monitor your interaction with
            that embedded content, including tracking your interaction with the
            embedded content if you have an account and are logged in to that
            website.
          </li>
          <li>
            If you upload images to the website, you should avoid uploading
            images with embedded location data (EXIF GPS) included. Visitors to
            the website can download and extract any location data from images
            on the website.
          </li>
        </ul>
        <p className="italic">
          Disclaimer: The above content is created at CHILTEL INDIA PRIVATE
          LIMITED's sole discretion.
        </p>
      </div>
    </div>
  );

  const PrivacyContent = () => (
    <div className="text-sm space-y-6 max-h-[70vh] overflow-y-auto p-4">
      {/* <h2 className="mb-4 text-lg font-semibold">Privacy Policy</h2> */}
      <div className="space-y-4">
        <p>
          This privacy policy sets out how CHILTEL INDIA PRIVATE LIMITED uses
          and protects any information that you give CHILTEL INDIA PRIVATE
          LIMITED when you use this website.
        </p>
        <p>
          CHILTEL INDIA PRIVATE LIMITED is committed to ensuring that your
          privacy is protected. Should we ask you to provide certain information
          by which you can be identified when using this website, then you can
          be assured that it will only be used in accordance with this privacy
          statement.
        </p>
        <p>
          CHILTEL INDIA PRIVATE LIMITED may change this policy from time to time
          by updating this page. You should check this page from time to time to
          ensure that you are happy with any changes.
        </p>
        <div className="space-y-2">
          <h3 className="font-semibold">
            We may collect the following information:
          </h3>
          <ul className="pl-6 space-y-2 list-disc">
            <li>Name and job title</li>
            <li>Contact information including email address</li>
            <li>
              Demographic information such as postcode, preferences, and
              interests
            </li>
            <li>
              Other information relevant to customer surveys and/or offers
            </li>
          </ul>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">
            What we do with the information we gather:
          </h3>
          <ul className="pl-6 space-y-2 list-disc">
            <li>Internal record keeping</li>
            <li>Improving our products and services</li>
            <li>
              Periodically sending promotional emails about new products,
              special offers, or other information which we think you may find
              interesting using the email address you have provided
            </li>
            <li>
              From time to time, contacting you for market research purposes via
              email, phone, fax, or mail
            </li>
            <li>Customizing the website according to your interests</li>
          </ul>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">
            We are committed to ensuring that your information is secure:
          </h3>
          <p>
            In order to prevent unauthorized access or disclosure, we have put
            in place suitable measures.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">How we use cookies:</h3>
          <p>
            A cookie is a small file which asks permission to be placed on your
            computer's hard drive. Once you agree, the file is added and the
            cookie helps analyze web traffic or lets you know when you visit a
            particular site. Cookies allow web applications to respond to you as
            an individual, tailoring operations to your needs by remembering
            your preferences.
          </p>
          <p>
            We use traffic log cookies to identify which pages are being used.
            This helps us analyze data about webpage traffic and improve our
            website to tailor it to customer needs. We only use this information
            for statistical analysis purposes and then remove the data from the
            system.
          </p>
          <p>
            Overall, cookies help us provide you with a better website by
            enabling us to monitor which pages you find useful and which you do
            not. A cookie in no way gives us access to your computer or any
            information about you, other than the data you choose to share with
            us.
          </p>
          <p>
            You can choose to accept or decline cookies. Most web browsers
            automatically accept cookies, but you can usually modify your
            browser setting to decline cookies if you prefer. This may prevent
            you from taking full advantage of the website.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">
            Controlling your personal information:
          </h3>
          <p>
            You may choose to restrict the collection or use of your personal
            information in the following ways:
          </p>
          <ul className="pl-6 space-y-2 list-disc">
            <li>
              Whenever you are asked to fill in a form on the website, look for
              the box to indicate that you do not want the information to be
              used for direct marketing purposes
            </li>
            <li>
              If you have previously agreed to us using your personal
              information for direct marketing purposes, you may change your
              mind at any time by writing to or emailing us
            </li>
          </ul>
          <p>
            We will not sell, distribute, or lease your personal information to
            third parties unless we have your permission or are required by law.
            We may use your personal information to send you promotional
            information about third parties which we think you may find
            interesting if you tell us that you wish this to happen.
          </p>
          <p>
            If you believe that any information we are holding on you is
            incorrect or incomplete, please write to or email us as soon as
            possible. We will promptly correct any information found to be
            incorrect.
          </p>
        </div>
        <p className="italic">
          Disclaimer: The above content is created at CHILTEL INDIA PRIVATE
          LIMITED's sole discretion.
        </p>
      </div>
    </div>
  );

  const RefundContent = () => (
    <div className="text-sm space-y-6 max-h-[70vh] overflow-y-auto p-4">
      {/* <h2 className="mb-4 text-lg font-semibold">Cancellation & Refund Policy</h2> */}
      <div className="space-y-4">
        <p>
          CHILTEL INDIA PRIVATE LIMITED believes in helping its customers as far
          as possible, and has therefore a liberal cancellation policy. Under
          this policy:
        </p>
        <ul className="pl-6 space-y-2 list-disc">
          <li>
            Cancellations will be considered only if the request is made
            immediately after placing the order. However, the cancellation
            request may not be entertained if the orders have been communicated
            to the vendors/merchants and they have initiated the process of
            shipping them.
          </li>
          <li>
            CHILTEL INDIA PRIVATE LIMITED does not accept cancellation requests
            for perishable items like flowers, eatables etc. However,
            refund/replacement can be made if the customer establishes that the
            quality of product delivered is not good.
          </li>
          <li>
            {" "}
            In case of receipt of damaged or defective items please report the
            same to our Customer Service team. The request will, however, be
            entertained once the merchant has checked and determined the same at
            his own end. This should be reported within 2 days of receipt of the
            products.
          </li>
          <li>
            {" "}
            In case you feel that the product received is not as shown on the
            site or as per your expectations, you must bring it to the notice of
            our customer service within 2 days of receiving the product. The
            Customer Service Team after looking into your complaint will take an
            appropriate decision.
          </li>
          <li>
            {" "}
            In case of complaints regarding products that come with a warranty
            from manufacturers, please refer the issue to them.
          </li>
          <li>
            {" "}
            In case of any Refunds approved by the CHILTEL INDIA PRIVATE
            LIMITED, it’ll take 3-5 days for the refund to be processed to the
            end customer.
          </li>
        </ul>
        <p className="italic">
          Disclaimer: The above content is created at CHILTEL INDIA PRIVATE
          LIMITED's sole discretion.
        </p>
      </div>
    </div>
  );

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
              href="https://www.chiltel.com"
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              <img src="/assets/google.png" alt="Google" className="w-5 h-5" />
            </a>
            <a
              href="https://www.facebook.com/chiltelindia/"
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              <img
                src="/assets/facebook.png"
                alt="Facebook"
                className="w-5 h-5"
              />
            </a>
            <a
              href="#"
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              <img
                src="/assets/instagram.png"
                alt="Instagram"
                className="w-5 h-5"
              />
            </a>
            <a
              href="#"
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              <img
                src="/assets/linkedin.png"
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
              <Link href="/collection" className="text-gray-600 hover:text-black">
                Chill Mart
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-600 hover:text-black">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-gray-600 hover:text-black">
                Blog
              </Link>
            </li>
            <li>
              <Dialog>
                <DialogTrigger className="text-gray-600 hover:text-black">
                  Privacy Policy
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Privacy Policy</DialogTitle>
                  </DialogHeader>
                  <PrivacyContent />
                </DialogContent>
              </Dialog>
            </li>
            <li>
              <Dialog>
                <DialogTrigger className="text-gray-600 hover:text-black">
                  Terms & Conditions
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Terms & Conditions</DialogTitle>
                  </DialogHeader>
                  <TermsContent />
                </DialogContent>
              </Dialog>
            </li>
            <li>
              <Dialog>
                <DialogTrigger className="text-gray-600 hover:text-black">
                  Refund Policy
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Refund & Cancellation Policy</DialogTitle>
                  </DialogHeader>
                  <RefundContent />
                </DialogContent>
              </Dialog>
            </li>

            <li>
              <a
                href="#"
                className="flex items-center text-gray-600 hover:text-black"
              >
                <span className="mr-2">👤</span> Register as Seller
              </a>
            </li>
            <li>
              <a
                href="https://chiltel-rider.vercel.app"
                className="flex items-center text-gray-600 hover:text-black"
              >
                <span className="mr-2">👥</span> Register as Service Partner
              </a>
            </li>
          </ul>
        </div>

        {/* Search and Contact Section */}
        <div className="w-full md:w-1/3">
          <h3 className="mb-4 text-lg font-semibold">CONTACTS</h3>
          <p className="mb-2 text-gray-600">
            🏠 Shristi Apartment, Flat No - 1 D/2, Nowbhanga, SEC-IV, North 24
            Parganas, Kolkata - 700105
          </p>
          <p className="mb-2 text-gray-600">
            📧{" "}
            <a href="mailto:info@chiltel.com" className="hover:text-black">
              info@chiltel.com
            </a>
          </p>
          <p className="mb-2 text-gray-600">
            📞{" "}
            <a href="tel:+917003326830" className="hover:text-black">
              +91 70033 26830
            </a>
          </p>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-500">
        <div className="flex flex-col items-center mx-4 space-y-2 md:flex-row justify-evenly md:mx-8 md:space-y-0 md:space-x-4">
          <p className="md:ml-5">
            &copy; Copyright 2024 Chiltel India Private Limited. All rights
            reserved. | CIN: U52100WB2021PTC250206
          </p>
          <p className="md:mr-5">Made with Love in India</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
