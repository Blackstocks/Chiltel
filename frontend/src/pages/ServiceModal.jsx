import { useContext, useState, useEffect } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { ShopContext } from "../context/ShopContext";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import ModalLoader from "../components/ModalLoader";
import ServiceCartContext from "../context/ServiceCartContext";

const ServiceModal = ({ isOpen, onClose, category }) => {
  if (!isOpen) return null;

  const { user } = useContext(AuthContext);
  const { backendUrl, token } = useContext(ShopContext);
  const { addToServiceCart } = useContext(ServiceCartContext);

  const today = new Date();

  const [services, setServices] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [scheduleService, setScheduleService] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDay, setSelectedDay] = useState(today.toISOString().split("T")[0]); // Default to today
  const [selectedTime, setSelectedTime] = useState("");
  const [remarks, setRemarks] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });

    const fetchStateByPincode = async (pincode) => {
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();
      if (data[0].Status === "Success") {
        return data[0].PostOffice[0].State; // Get the state
      }
      return null;
    } catch (error) {
      console.error("Error fetching state:", error);
      return null;
    }
  };

  const handleZipCodeChange = async (e) => {
    const zipCode = e.target.value;
    setAddress((prev) => ({ ...prev, zipCode }));

    if (zipCode.length === 6) {
      const state = await fetchStateByPincode(zipCode);
      setAddress((prev) => ({ ...prev, state: state || "" })); // Auto-fill state
    }
  };

  // Fetch and organize services by product and category
  const fetchAndOrganizeServices = async () => {
    setServicesLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/services/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const rawData = response.data.data;

        // Organize services into a structured object
        const organizedServices = {};
        rawData.forEach((item) => {
          if (!organizedServices[item.product]) {
            organizedServices[item.product] = {};
          }
          if (!organizedServices[item.product][item.category]) {
            organizedServices[item.product][item.category] = [];
          }
          organizedServices[item.product][item.category].push({
            _id: item._id,
            name: item.name,
            price: item.price,
            duration: item.estimatedDuration,
            description: item.description,
          });
        });

        setServices(organizedServices);
      } else {
        console.error("Error fetching services:", response.data.message);
      }
    } catch (err) {
      console.error("Error fetching services:", err);
    }finally{
      setServicesLoading(false);
    }
  };

  useEffect(() => {
    fetchAndOrganizeServices();
  }, []);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 22; hour++) {
      slots.push(`${hour}:00`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Utility function to convert 12-hour AM/PM to 24-hour format
  const convertTo24HourFormat = (time12hr) => {
    const [time, modifier] = time12hr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const handleScheduleConfirm = async () => {
    if (!selectedDay || !selectedTime) {
      alert("Please select both date and time.");
      return;
    }

    if (!address.street || !address.city || !address.state || !address.zipCode) {
      alert("Please fill out all address fields.");
      return;
    }

    try {
      console.log("Scheduled Service:", scheduleService);
      const time24hr = convertTo24HourFormat(selectedTime);
      const scheduledDateTime = new Date(`${selectedDay}T${time24hr}:00`).toISOString();
      // const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}:00`).toISOString();
      const serviceRequest = {
        user: user._id,
        service: scheduleService.service._id,
        userLocation: {
          type: "Point",
          coordinates: [0.0, 0.0], // Replace with actual coordinates if available
          address: `${address.street}, ${address.city}, ${address.state}, ${address.zipCode}`,
        },
        scheduledFor: scheduledDateTime,
        // scheduledFor: `${selectedDate}T${selectedTime}:00`,
        price: scheduleService.service.price,
        remarks,
      }
      await addToServiceCart(scheduleService, serviceRequest);
      onClose();
      // const response = await axios.post(`${backendUrl}/api/serviceRequests/`, {
      //   user: user._id,
      //   service: scheduleService.service._id,
      //   userLocation: {
      //     type: "Point",
      //     coordinates: [0.0, 0.0], // Replace with actual coordinates if available
      //     address: `${address.street}, ${address.city}, ${address.state}, ${address.zipCode}`,
      //   },
      //   scheduledFor: scheduledDateTime,
      //   // scheduledFor: `${selectedDate}T${selectedTime}:00`,
      //   price: scheduleService.service.price,
      //   remarks,
      // });
      // console.log('service request: ', response.data);

      // if (response.data.success) {
      //   toast.success("Service scheduled successfully.");
      //   onClose();
      // } else {
      //   toast.error("Failed to schedule the service.");
      // }
    } catch (err) {
      console.error("Error scheduling service:", err);
      toast.error("An error occurred while scheduling the service.");
    }
  };

  const renderServiceCard = (service, categoryName) => (
    <div className="p-4 transition-shadow bg-white border rounded-lg hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
          <p className="mt-1 text-sm text-gray-600">{service.description}</p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-sm">{service.duration}</span>
            </div>
            <div className="font-medium text-gray-900">₹{service.price}</div>
          </div>
        </div>
        <button
          onClick={() => setScheduleService({ service, categoryName })}
          className="px-4 py-2 text-sm text-black transition-all duration-300 bg-white border border-black rounded-md hover:bg-black hover:text-white whitespace-nowrap"
        >
          Schedule
        </button>
      </div>
    </div>
  );

  const renderProductServices = (productName) => (
    <div className="space-y-4">
      {Object.entries(services[productName] || {}).map(([categoryName, categoryServices]) => (
        <div key={categoryName} className="overflow-hidden border rounded-lg">
          <button
            onClick={() =>
              setExpandedCategory(expandedCategory === categoryName ? null : categoryName)
            }
            className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100"
          >
            <span className="font-semibold">{categoryName}</span>
            {expandedCategory === categoryName ? <ChevronUp /> : <ChevronDown />}
          </button>
          {expandedCategory === categoryName && (
            <div className="p-4 space-y-4 bg-gray-50">
              {categoryServices.map((service, idx) => (
                <div key={idx}>{renderServiceCard(service, categoryName)}</div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderScheduleModal = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);
  
  
    // Calculate valid time slots
    const getValidTimeSlots = () => {
      const allSlots = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"];
      if (selectedDay === today.toISOString().split("T")[0]) {
        const currentTime = new Date();
        currentTime.setHours(currentTime.getHours() + 4); // Add 4-hour buffer
        const currentHour = currentTime.getHours();
        const validSlots = allSlots.filter((slot) => {
          const slotHour = parseInt(slot.split(":")[0], 10);
          const isPM = slot.includes("PM");
          const adjustedHour = isPM && slotHour !== 12 ? slotHour + 12 : slotHour; // Convert to 24-hour format
          return adjustedHour >= currentHour;
        });
        return validSlots;
      }
      return allSlots; // Return all slots for tomorrow and day after
    };
  
    const validTimeSlots = getValidTimeSlots();
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
        <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-bold">Schedule Service</h2>
          <div className="mt-4 space-y-4">
            {/* Day Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Day</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[today, tomorrow, dayAfterTomorrow].map((date, idx) => (
                  <button
                    key={idx}
                    className={`px-4 py-2 border rounded-md ${
                      selectedDay === date.toISOString().split("T")[0]
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedDay(date.toISOString().split("T")[0])}
                  >
                    {idx === 0 ? "Today" : idx === 1 ? "Tomorrow" : "Day After"}
                  </button>
                ))}
              </div>
            </div>
  
            {/* Time Slot Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Time</label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {validTimeSlots.map((slot, idx) => (
                  <button
                    key={idx}
                    className={`px-4 py-2 border rounded-md ${
                      selectedTime === slot
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedTime(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
  
            {/* Address Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <div className="mt-4 space-y-4">
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="Street"
                  value={address.street}
                  onChange={(e) => setAddress((prev) => ({ ...prev, street: e.target.value }))}
                />
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress((prev) => ({ ...prev, city: e.target.value }))}
                />
                <input
                  type="number"
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="PIN Code"
                  value={address.zipCode}
                  onChange={handleZipCodeChange}
                />
                <p className="mt-2 text-sm text-gray-700">State: {address.state || "Enter a valid PIN code to auto-fill"}</p>
              </div>
            </div>
  
            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Remarks</label>
              <input
                type="text"
                className="w-full px-4 py-2 mt-1 border rounded-md"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-4 mt-6">
            <button
              onClick={() => {
                setScheduleService(null);
                setAddress({
                  street: "",
                  city: "",
                  state: "",
                  zipCode: "",
                });
                setRemarks("");
                setSelectedDate("");
                setSelectedDay(today.toISOString().split("T")[0])
                setSelectedTime("");
              }}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => handleScheduleConfirm(scheduleService.service)}
              className="px-4 py-2 text-sm text-white bg-black rounded-md hover:bg-gray-800"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };
  

  // const renderScheduleModal = () => (
  //   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
  //      {/* overflow-y-auto above */}
  //     <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
  //       <h2 className="text-lg font-bold">Schedule Service</h2>
  //       <div className="mt-4 space-y-4">
  //         {/* Date Selection */}
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700">
  //             Select Date
  //           </label>
  //           <input
  //             type="date"
  //             className="w-full px-4 py-2 mt-1 border rounded-md"
  //             value={selectedDate}
  //             min={new Date(new Date().setDate(new Date().getDate() + 1))
  //               .toISOString()
  //               .split("T")[0]} // Disable today and past dates
  //             onChange={(e) => setSelectedDate(e.target.value)}
  //           />
  //         </div>

  //         {/* Time Slot Selection */}
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700">
  //             Select Time
  //           </label>
  //           <div className="grid grid-cols-4 gap-2 mt-2">
  //             {timeSlots.map((slot, idx) => (
  //               <button
  //                 key={idx}
  //                 className={`px-4 py-2 border rounded-md ${
  //                   selectedTime === slot
  //                     ? "bg-black text-white"
  //                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
  //                 }`}
  //                 onClick={() => setSelectedTime(slot)}
  //               >
  //                 {slot}
  //               </button>
  //             ))}
  //           </div>
  //         </div>

  //         {/* Address Input */}
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700">
  //             Address
  //           </label>
  //                 <div className="mt-4 space-y-4">
  //       {/* Street Input */}
  //       <input
  //         type="text"
  //         className="w-full px-4 py-2 border rounded-md"
  //         placeholder="Street"
  //         value={address.street}
  //         onChange={(e) =>
  //           setAddress((prev) => ({ ...prev, street: e.target.value }))
  //         }
  //       />

  //       {/* City Input */}
  //       <input
  //         type="text"
  //         className="w-full px-4 py-2 border rounded-md"
  //         placeholder="City"
  //         value={address.city}
  //         onChange={(e) =>
  //           setAddress((prev) => ({ ...prev, city: e.target.value }))
  //         }
  //       />

  //       {/* ZIP Code Input */}
  //       <input
  //         type="number"
  //         className="w-full px-4 py-2 border rounded-md"
  //         placeholder="PIN Code"
  //         value={address.zipCode}
  //         onChange={handleZipCodeChange}
  //       />
  //     </div>
  //     <p className="mt-2 text-sm text-gray-700">
  //       State: {address.state || "Enter a valid PIN code to auto-fill"}
  //     </p>

  //       {/* State Input */}
  //       <div className="relative">
  //         <input
  //           type="text"
  //           className="w-full px-4 py-2 border rounded-md"
  //           placeholder="State"
  //           value={address.state}
  //           readOnly // Make state field read-only
  //         />
  //         {isLoading && (
  //           <div className="absolute inset-y-0 right-3 flex items-center">
  //             <svg
  //               className="w-5 h-5 text-gray-500 animate-spin"
  //               xmlns="http://www.w3.org/2000/svg"
  //               fill="none"
  //               viewBox="0 0 24 24"
  //             >
  //               <circle
  //                 className="opacity-25"
  //                 cx="12"
  //                 cy="12"
  //                 r="10"
  //                 stroke="currentColor"
  //                 strokeWidth="4"
  //               ></circle>
  //               <path
  //                 className="opacity-75"
  //                 fill="currentColor"
  //                 d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
  //               ></path>
  //             </svg>
  //           </div>
  //         )}
  //       </div>

  //         </div>

  //         <div>
  //           <label className="block text-sm font-medium text-gray-700">
  //             Remarks
  //           </label>
  //           <input
  //             type="text"
  //             className="w-full px-4 py-2 mt-1 border rounded-md"
  //             value={remarks}
  //             onChange={(e) => setRemarks(e.target.value)}
  //           />
  //         </div>
  //       </div>
  //       <div className="flex items-center justify-end gap-4 mt-6">
  //         <button
  //           onClick={() => {
  //             setScheduleService(null)
  //             setAddress({
  //               street: "",
  //               city: "",
  //               state: "",
  //               zipCode: "",
  //             })
  //             setSelectedServices([])
  //             setRemarks('')
  //             setSelectedDate("")
  //             setSelectedTime("")
  //           }}
  //           className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
  //         >
  //           Cancel
  //         </button>
  //         <button
  //           onClick={()=>handleScheduleConfirm(scheduleService.service)}
  //           className="px-4 py-2 text-sm text-white bg-black rounded-md hover:bg-gray-800"
  //         >
  //           Confirm
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-3xl mx-4 my-6 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between sticky top-0 z-10 p-6 bg-white border-b rounded-t-lg">
          <h2 className="text-2xl font-bold text-gray-800">{category?.name} Services</h2>
          <button
              onClick={onClose}
              className="p-2 text-gray-500 transition-colors rounded-full hover:text-gray-700 hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
        </div>
        <div className="max-h-[calc(100vh-16rem)] overflow-y-auto p-6">
          {servicesLoading && <ModalLoader />}
          {renderProductServices(category?.name || "Unknown")}
        </div>
      </div>
      {scheduleService && renderScheduleModal()}
    </div>
  );
};

export default ServiceModal;



// import React, { useContext, useEffect, useState } from "react";
// import { ChevronDown, ChevronUp, Clock, Plus, Minus } from "lucide-react";
// import AuthContext from "../context/AuthContext";
// import axios from "axios";
// import { ShopContext } from "../context/ShopContext";
// import { toast } from "react-toastify";

// const ServiceModal = ({ isOpen, onClose, category }) => {
//   if (!isOpen) return null;

//   const {user} = useContext(AuthContext);
//   const {backendUrl} = useContext(ShopContext);

// 	const [services, setServices] = useState({});
//   const [expandedCategory, setExpandedCategory] = useState(null);
//   const [selectedServices, setSelectedServices] = useState([]);
//   const [selectedService, setSelectedService] = useState([]);
//   const [scheduleService, setScheduleService] = useState(null);
//   const [remarks, setRemarks] = useState('');
//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedTime, setSelectedTime] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
//   const [address, setAddress] = useState({
//     street: "",
//     city: "",
//     state: "",
//     zipCode: "",
//   });

//   const fetchAndOrganizeServices = async () => {
//     try {
//     const response = await axios.get(`${backendUrl}/api/services/`, {
//       headers: {
//       Authorization: `Bearer ${token}`,
//       },
//     });
  
//     if (response.data.success) {
//       const rawData = response.data.data;
  
//       // Initialize an empty services object
//       const organizedServices = {};
  
//       // Iterate over the fetched data
//       rawData.forEach((item) => {
//       // Ensure the product exists in the services object
//       if (!organizedServices[item.product]) {
//         organizedServices[item.product] = {};
//       }
  
//       // Ensure the category exists under the product
//       if (!organizedServices[item.product][item.category]) {
//         organizedServices[item.product][item.category] = [];
//       }
  
//       // Push the service details into the appropriate category
//       organizedServices[item.product][item.category].push({
//         _id: item._id,
//         name: item.name,
//         price: item.price,
//         duration: item.estimatedDuration,
//         description: item.description,
//       });
//       });
  
//       setServices(organizedServices);
//       console.log("Organized Services:", organizedServices);
//     } else {
//       console.error("Error fetching services:", response.data.message);
//     }
//     } catch (err) {
//     console.error("Error fetching services:", err);
//     }
//   };
  
//   useEffect(() => {
//     fetchAndOrganizeServices();
//   }, []);

//   const fetchStateByPincode = async (pincode) => {
//     try {
//       const response = await fetch(
//         `https://api.postalpincode.in/pincode/${pincode}`
//       );
//       const data = await response.json();
//       if (data[0].Status === "Success") {
//         return data[0].PostOffice[0].State; // Get the state
//       }
//       return null;
//     } catch (error) {
//       console.error("Error fetching state:", error);
//       return null;
//     }
//   };

  // const handleZipCodeChange = async (e) => {
  //   const zipCode = e.target.value;
  //   setAddress((prev) => ({ ...prev, zipCode }));

  //   if (zipCode.length === 6) {
  //     const state = await fetchStateByPincode(zipCode);
  //     setAddress((prev) => ({ ...prev, state: state || "" })); // Auto-fill state
  //   }
  // };

//   const acServiceCategories = {
//     Installation: [
//       {
//         _id: 1,
//         name: "Window AC Installation",
//         price: 700,
//         duration: "2-3 hours",
//         description:
//           "Professional installation including brackets and basic materials",
//       },
//       {
//         _id: 2,
//         name: "Split AC Installation",
//         price: 1800,
//         duration: "3-4 hours",
//         description:
//           "Complete split AC installation with copper piping up to 3ft",
//       },
//     ],
//     Service: [
//       {
//         name: "Dry Service",
//         price: 499,
//         duration: "40 minutes",
//         description: "Basic cleaning and maintenance",
//       },
//       {
//         name: "Deep Clean Service",
//         price: 799,
//         duration: "90 minutes",
//         description: "Thorough cleaning with foam wash",
//       },
//     ],
//   };

//   const generateTimeSlots = () => {
//     const slots = [];
//     for (let hour = 9; hour <= 17; hour++) {
//       slots.push(`${hour}:00`);
//     }
//     return slots;
//   };

//   const timeSlots = generateTimeSlots();

//   const handleAddService = (service, categoryName) => {
//     setScheduleService({ service, categoryName });
//   };

//   const combineDateAndTime = (date, time) => {
//     // Combine the date and time into a single string
//     const dateTimeString = `${date}T${time}:00`; // Add seconds for ISO format
  
//     // Create a Date object
//     return new Date(dateTimeString);
//   };

//   const handleScheduleConfirm = async (service) => {
//     if (!selectedDate || !selectedTime) {
//       alert("Please select both date and time.");
//       return;
//     }

//     if (!address.street || !address.city || !address.state || !address.zipCode) {
//       alert("Please fill out all address fields.");
//       return;
//     }

//     try{
//       console.log('scheduled service: ', scheduleService);
//       const response = await axios.post(backendUrl + '/api/serviceRequests/service-requests',{
//         user,
//         service: scheduleService.service._id,
//         userLocation: {
//           type: "Point",
//           coordinates: [0.0, 0.0],
//           address: address.street + '|' + address.city + '|' + address.state
//         },
//         scheduledFor: combineDateAndTime(selectedDate, selectedTime),
//         price: service.price,
//         remarks
//       });
//       const newService = {
//         ...scheduleService.service,
//         category: scheduleService.categoryName,
//         quantity: 1,
//         scheduledDate: selectedDate,
//         scheduledTime: selectedTime,
//         address,
//       };
  
//       setSelectedServices((prev) => [...prev, newService]);
//       setScheduleService(null);
//       setSelectedDate("");
//       setSelectedTime("");
//       setAddress({
//         street: "",
//         city: "",
//         state: "",
//         zipCode: "",
//       });
//       console.log('Service request response: ', response);
//       toast.success('Service created successfully')
//     }catch(err){
//       console.error('Error while creating service request: ', err);
//       toast.error('Something went wrong');
//     }

//   };

//   const renderServiceCard = (service, categoryName) => (
//     <div className="p-4 transition-shadow bg-white border rounded-lg hover:shadow-md">
//       <div className="flex items-start justify-between">
//         <div className="flex-grow">
//           <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
//           <p className="mt-1 text-sm text-gray-600">{service.description}</p>
//           <div className="flex items-center gap-4 mt-2">
//             <div className="flex items-center text-gray-500">
//               <Clock className="w-4 h-4 mr-1" />
//               <span className="text-sm">{service.duration}</span>
//             </div>
//             <div className="font-medium text-gray-900">₹{service.price}</div>
//           </div>
//         </div>
//         <div className="flex flex-col items-end gap-2">
//           <button
//             onClick={() => handleAddService(service, categoryName)}
//             className="px-4 py-2 text-sm text-black transition-all duration-300 bg-white border border-black rounded-md hover:bg-black hover:text-white whitespace-nowrap"
//           >
//             Add Service
//           </button>
//         </div>
//       </div>
//     </div>
//   );

  // const renderScheduleModal = () => (
  //   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
  //      {/* overflow-y-auto above */}
  //     <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
  //       <h2 className="text-lg font-bold">Schedule Service</h2>
  //       <div className="mt-4 space-y-4">
  //         {/* Date Selection */}
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700">
  //             Select Date
  //           </label>
  //           <input
  //             type="date"
  //             className="w-full px-4 py-2 mt-1 border rounded-md"
  //             value={selectedDate}
  //             min={new Date(new Date().setDate(new Date().getDate() + 1))
  //               .toISOString()
  //               .split("T")[0]} // Disable today and past dates
  //             onChange={(e) => setSelectedDate(e.target.value)}
  //           />
  //         </div>

  //         {/* Time Slot Selection */}
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700">
  //             Select Time
  //           </label>
  //           <div className="grid grid-cols-4 gap-2 mt-2">
  //             {timeSlots.map((slot, idx) => (
  //               <button
  //                 key={idx}
  //                 className={`px-4 py-2 border rounded-md ${
  //                   selectedTime === slot
  //                     ? "bg-black text-white"
  //                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
  //                 }`}
  //                 onClick={() => setSelectedTime(slot)}
  //               >
  //                 {slot}
  //               </button>
  //             ))}
  //           </div>
  //         </div>

  //         {/* Address Input */}
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700">
  //             Address
  //           </label>
  //                 <div className="mt-4 space-y-4">
  //       {/* Street Input */}
  //       <input
  //         type="text"
  //         className="w-full px-4 py-2 border rounded-md"
  //         placeholder="Street"
  //         value={address.street}
  //         onChange={(e) =>
  //           setAddress((prev) => ({ ...prev, street: e.target.value }))
  //         }
  //       />

  //       {/* City Input */}
  //       <input
  //         type="text"
  //         className="w-full px-4 py-2 border rounded-md"
  //         placeholder="City"
  //         value={address.city}
  //         onChange={(e) =>
  //           setAddress((prev) => ({ ...prev, city: e.target.value }))
  //         }
  //       />

  //       {/* ZIP Code Input */}
  //       <input
  //         type="number"
  //         className="w-full px-4 py-2 border rounded-md"
  //         placeholder="PIN Code"
  //         value={address.zipCode}
  //         onChange={handleZipCodeChange}
  //       />
  //     </div>
  //     <p className="mt-2 text-sm text-gray-700">
  //       State: {address.state || "Enter a valid PIN code to auto-fill"}
  //     </p>

  //       {/* State Input */}
  //       <div className="relative">
  //         <input
  //           type="text"
  //           className="w-full px-4 py-2 border rounded-md"
  //           placeholder="State"
  //           value={address.state}
  //           readOnly // Make state field read-only
  //         />
  //         {isLoading && (
  //           <div className="absolute inset-y-0 right-3 flex items-center">
  //             <svg
  //               className="w-5 h-5 text-gray-500 animate-spin"
  //               xmlns="http://www.w3.org/2000/svg"
  //               fill="none"
  //               viewBox="0 0 24 24"
  //             >
  //               <circle
  //                 className="opacity-25"
  //                 cx="12"
  //                 cy="12"
  //                 r="10"
  //                 stroke="currentColor"
  //                 strokeWidth="4"
  //               ></circle>
  //               <path
  //                 className="opacity-75"
  //                 fill="currentColor"
  //                 d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
  //               ></path>
  //             </svg>
  //           </div>
  //         )}
  //       </div>

  //         </div>

  //         <div>
  //           <label className="block text-sm font-medium text-gray-700">
  //             Remarks
  //           </label>
  //           <input
  //             type="text"
  //             className="w-full px-4 py-2 mt-1 border rounded-md"
  //             value={remarks}
  //             onChange={(e) => setRemarks(e.target.value)}
  //           />
  //         </div>
  //       </div>
  //       <div className="flex items-center justify-end gap-4 mt-6">
  //         <button
  //           onClick={() => {
  //             setScheduleService(null)
  //             setAddress({
  //               street: "",
  //               city: "",
  //               state: "",
  //               zipCode: "",
  //             })
  //             setSelectedServices([])
  //             setRemarks('')
  //             setSelectedDate("")
  //             setSelectedTime("")
  //           }}
  //           className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
  //         >
  //           Cancel
  //         </button>
  //         <button
  //           onClick={()=>handleScheduleConfirm(scheduleService.service)}
  //           className="px-4 py-2 text-sm text-white bg-black rounded-md hover:bg-gray-800"
  //         >
  //           Confirm
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );

//   const renderAirConditionerServices = () => (
//     <div className="space-y-4">
//       {Object.entries(acServiceCategories).map(([categoryName, services]) => (
//         <div key={categoryName} className="overflow-hidden border rounded-lg">
//           <button
//             onClick={() =>
//               setExpandedCategory(expandedCategory === categoryName ? null : categoryName)
//             }
//             className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100"
//           >
//             {/* idhar */}
//             <span className="font-semibold">{categoryName}</span>
//             {expandedCategory === categoryName ? <ChevronUp /> : <ChevronDown />}
//           </button>
//           {expandedCategory === categoryName && (
//             <div className="p-4 space-y-4 bg-gray-50">
//               {services.map((service, idx) => (
//                 <div key={idx}>{renderServiceCard(service, categoryName)}</div>
//               ))}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="relative w-full max-w-3xl mx-4 my-6 bg-white rounded-lg shadow-xl">
//         <div className="sticky top-0 z-10 p-6 bg-white border-b rounded-t-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800">
//                 {category?.name} Services
//               </h2>
//               <p className="mt-1 text-sm text-gray-500">
//                 Select from our professional service options
//               </p>
//             </div>
            // <button
            //   onClick={onClose}
            //   className="p-2 text-gray-500 transition-colors rounded-full hover:text-gray-700 hover:bg-gray-100"
            // >
            //   <svg
            //     className="w-6 h-6"
            //     fill="none"
            //     stroke="currentColor"
            //     viewBox="0 0 24 24"
            //   >
            //     <path
            //       strokeLinecap="round"
            //       strokeLinejoin="round"
            //       strokeWidth="2"
            //       d="M6 18L18 6M6 6l12 12"
            //     />
            //   </svg>
            // </button>
//           </div>
//         </div>
//         <div className="max-h-[calc(100vh-16rem)] overflow-y-auto p-6">
//           {category?.name === "Air Conditioner" && renderAirConditionerServices()}
//         </div>
//         {selectedServices.length > 0 && (
//           <div className="sticky bottom-0 p-6 bg-white border-t">
//             <button
//               onClick={() => alert("Proceeding to checkout...")}
//               className="w-full px-6 py-3 text-white transition-colors bg-black rounded-md hover:bg-gray-800"
//             >
//               Proceed to Checkout
//             </button>
//           </div>
//         )}
//       </div>
//       {scheduleService && renderScheduleModal()}
//     </div>
//   );
// };

// export default ServiceModal;





// import React, { useState } from 'react';
// import { ChevronDown, ChevronUp, Clock, Plus, Minus } from 'lucide-react';

// const ServiceModal = ({ isOpen, onClose, category }) => {
//   if (!isOpen) return null;

//   const [expandedCategory, setExpandedCategory] = useState(null);
//   const [selectedServices, setSelectedServices] = useState([]);

//   // Main categories and their subcategories for AC
  // const acServiceCategories = {
  //   "Installation": [
  //     { 
  //       name: "Window AC Installation",
  //       price: 700,
  //       duration: "2-3 hours",
  //       description: "Professional installation including brackets and basic materials" 
  //     },
  //     { 
  //       name: "Split AC Installation",
  //       price: 1800,
  //       duration: "3-4 hours",
  //       description: "Complete split AC installation with copper piping up to 3ft" 
  //     }
  //   ],
  //   "Service": [
  //     { 
  //       name: "Dry Service",
  //       price: 499,
  //       duration: "40 minutes",
  //       description: "Basic cleaning and maintenance" 
  //     },
  //     { 
  //       name: "Deep Clean Service",
  //       price: 799,
  //       duration: "90 minutes",
  //       description: "Thorough cleaning with foam wash" 
  //     },
  //     { 
  //       name: "Wet Service",
  //       price: 599,
  //       duration: "1-2 hours",
  //       description: "Complete Wet Service with leak test" 
  //     }
  //   ],
  //   "Repair": [
  //     { 
  //       name: "Attending Charges",
  //       price: 499,
  //       duration: "30-60 minutes",
  //       description: "Diagnosis and minor repairs" 
  //     },
  //     { 
  //       name: "Gas Refilling",
  //       price: 1500,
  //       duration: "1-2 hours",
  //       description: "Gas Refilling and testing" 
  //     }
  //   ]
  // };

  // // Regular service details for other categories
  // const serviceDetails = {
  //   "Air Cooler": [
  //     { name: "Installation", price: "₹500", duration: "1 hour", description: "Setup and testing included" },
  //     { name: "General Service", price: "₹399", duration: "1 hour", description: "Complete cleaning and maintenance" },
  //     { name: "Pad Replacement", price: "₹299", duration: "30 minutes", description: "High-quality cooling pad replacement" },
  //     { name: "Motor Repair", price: "₹699", duration: "1-2 hours", description: "Expert motor repair service" }
  //   ],
  //   // ... other categories remain the same
  // };

//   // Function to add service with quantity
//   const addService = (service, category) => {
//     const existingService = selectedServices.find(
//       s => s.name === service.name && s.category === category
//     );

//     if (existingService) {
//       setSelectedServices(selectedServices.map(s => 
//         s.name === service.name && s.category === category
//           ? { ...s, quantity: s.quantity + 1 }
//           : s
//       ));
//     } else {
//       setSelectedServices([...selectedServices, { 
//         ...service, 
//         category,
//         quantity: 1 
//       }]);
//     }
//   };

//   // Function to update quantity
//   const updateQuantity = (index, increment) => {
//     setSelectedServices(selectedServices.map((service, i) => {
//       if (i === index) {
//         const newQuantity = service.quantity + (increment ? 1 : -1);
//         return newQuantity > 0 
//           ? { ...service, quantity: newQuantity }
//           : null;
//       }
//       return service;
//     }).filter(Boolean));
//   };

//   const totalAmount = selectedServices.reduce((sum, service) => 
//     sum + (service.price * service.quantity), 0
//   );

//   const renderServiceCard = (service, categoryName) => {
//     const existingService = selectedServices.find(
//       s => s.name === service.name && s.category === categoryName
//     );
//     const quantity = existingService?.quantity || 0;

//     return (
//       <div className="p-4 transition-shadow bg-white border rounded-lg hover:shadow-md">
//         <div className="flex items-start justify-between">
//           <div className="flex-grow">
//             <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
//             <p className="mt-1 text-sm text-gray-600">{service.description}</p>
//             <div className="flex items-center gap-4 mt-2">
//               <div className="flex items-center text-gray-500">
//                 <Clock className="w-4 h-4 mr-1" />
//                 <span className="text-sm">{service.duration}</span>
//               </div>
//               <div className="font-medium text-gray-900">₹{service.price}</div>
//             </div>
//           </div>
//           <div className="flex flex-col items-end gap-2">
//             {quantity > 0 ? (
//               <div className="flex items-center gap-2 p-1 border rounded-md">
//                 <button 
//                   onClick={() => updateQuantity(selectedServices.indexOf(existingService), false)}
//                   className="p-1 text-gray-500 hover:text-gray-700"
//                 >
//                   <Minus size={16} />
//                 </button>
//                 <span className="w-8 text-center">{quantity}</span>
//                 <button 
//                   onClick={() => updateQuantity(selectedServices.indexOf(existingService), true)}
//                   className="p-1 text-gray-500 hover:text-gray-700"
//                 >
//                   <Plus size={16} />
//                 </button>
//               </div>
//             ) : (
//               <button
//                 onClick={() => addService(service, categoryName)}
//                 className="px-4 py-2 text-sm text-black transition-all duration-300 bg-white border border-black rounded-md hover:bg-black hover:text-white whitespace-nowrap"
//               >
//                 Add Service
//               </button>
//             )}
//             {quantity > 0 && (
//               <span className="text-sm font-medium text-gray-600">
//                 ₹{service.price * quantity}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderAirConditionerServices = () => (
//     <div className="space-y-4">
//       {Object.entries(acServiceCategories).map(([categoryName, services]) => (
//         <div key={categoryName} className="overflow-hidden border rounded-lg">
//           <button
//             onClick={() => setExpandedCategory(expandedCategory === categoryName ? null : categoryName)}
//             className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100"
//           >
//             <span className="font-semibold">{categoryName}</span>
//             {expandedCategory === categoryName ? <ChevronUp /> : <ChevronDown />}
//           </button>
          
//           {expandedCategory === categoryName && (
//             <div className="p-4 space-y-4 bg-gray-50">
//               {services.map((service, idx) => (
//                 <div key={idx}>{renderServiceCard(service, categoryName)}</div>
//               ))}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="relative w-full max-w-3xl mx-4 my-6 bg-white rounded-lg shadow-xl">
//         {/* Fixed header */}
//         <div className="sticky top-0 z-10 p-6 bg-white border-b rounded-t-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800">
//                 {category?.name} Services
//               </h2>
//               <p className="mt-1 text-sm text-gray-500">Select from our professional service options</p>
//             </div>
//             <div className="flex items-center gap-4">
//               {totalAmount > 0 && (
//                 <div className="text-right">
//                   <div className="text-sm text-gray-500">Total Amount</div>
//                   <div className="text-xl font-bold">₹{totalAmount}</div>
//                 </div>
//               )}
//               <button
//                 onClick={onClose}
//                 className="p-2 text-gray-500 transition-colors rounded-full hover:text-gray-700 hover:bg-gray-100"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Scrollable content */}
//         <div className="max-h-[calc(100vh-16rem)] overflow-y-auto p-6">
//           {category?.name === "Air Conditioner" ? renderAirConditionerServices() : null}
//         </div>

//         {/* Proceed button */}
//         {selectedServices.length > 0 && (
//           <div className="sticky bottom-0 p-6 bg-white border-t">
//             <button
//               onClick={() => alert('Proceeding to checkout...')}
//               className="w-full px-6 py-3 text-white transition-colors bg-black rounded-md hover:bg-gray-800"
//             >
//               Proceed to Checkout
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ServiceModal;