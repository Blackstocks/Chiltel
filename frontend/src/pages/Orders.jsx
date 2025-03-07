import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import ServiceCartContext from "../context/ServiceCartContext";
import { ChevronDown, ChevronUp } from "lucide-react";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const { user, loading } = useContext(AuthContext);
  const { serviceCart } = useContext(ServiceCartContext);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [orderData, setOrderData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [view, setView] = useState("products"); // Toggle between products and services
  const [expandedRow, setExpandedRow] = useState(null);

  const openPDF = (pdfPath) => {
    const pdfUrl = `${window.location.origin}${pdfPath}`;
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  const toggleRow = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };

  const loadOrderData = async () => {
    setOrdersLoading(true);
    try {
      if (!token) {
        return null;
      }
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        { userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        console.log("orders: ", response.data);
        const allProductOrders = [];
        const allServiceOrders = [];

        response.data.orders.forEach((order) => {
          // Extract product orders
          order.products.forEach((item) => {
            item["orderId"] = order._id;
            item["status"] = order.status;
            item["paymentMethod"] = order.paymentDetails.method;
            item["date"] = order.updatedAt;
            allProductOrders.push(item);
          });

          // Extract service orders
          order.services.forEach((service) => {
            service["status"] = order.status;
            service["paymentMethod"] = order.paymentDetails.method;
            service["date"] = order.updatedAt;
            allServiceOrders.push(service);
          });
        });

        setOrderData(allProductOrders);
        setServiceData(allServiceOrders.reverse());

        console.log("Order data: ", allProductOrders.reverse());
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error while fetching orders: ", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/cancel",
        { orderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        loadOrderData();
        toast.success("Order cancelled");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, []);

  if (loading || ordersLoading) return <Loading />;

  return (
    <div className="border-t pt-16 min-h-screen">
      {/* Page Title */}
      <div className="text-3xl font-bold text-gray-800 mb-6">
        <Title text1="MY" text2="ORDERS" />
      </div>

      {/* Toggle Buttons */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setView("products")}
          className={`px-6 py-2 rounded-l-lg border ${
            view === "products"
              ? "bg-black text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setView("services")}
          className={`px-6 py-2 rounded-r-lg border ${
            view === "services"
              ? "bg-black text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Services
        </button>
      </div>

      <div className="container mx-auto px-4">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="max-h-[40rem] overflow-y-auto">
            {/* Table Headers */}
            {view === "products" && (
              <div className="grid grid-cols-6 gap-4 bg-gray-100 py-3 px-4 text-gray-600 text-sm font-semibold sticky top-0 z-10">
                <div>Image</div>
                <div>Name</div>
                <div>Details</div>
                <div>Status</div>
                <div>Payment</div>
                <div className="text-center">Actions</div>
              </div>
            )}

            {view === "services" && (
              <div className="grid  sm:grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-4 text-gray-600 text-sm font-semibold sticky top-0 z-10">
                <div>Service</div>
                <div>Description</div>
                <div>Price</div>
                <div>Duration</div>
                <div>Status</div>
                <div>Payment Status</div>
              </div>
            )}

            {/* Product Orders */}
            {view === "products" &&
              orderData.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-6 gap-4 items-center border-b border-gray-200 py-4 px-4 text-sm"
                >
                  <div>
                    <img
                      className="w-16 h-16 object-cover rounded-md"
                      src={item.product?.thumbnail}
                      alt={item.product?.name || "Product Image"}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.product?.name}
                    </p>
                  </div>
                  <div>
                    <p>
                      Price:{" "}
                      <span className="font-medium">
                        {currency}
                        {item.price}
                      </span>
                    </p>
                    <p>
                      Quantity:{" "}
                      <span className="font-medium">{item.quantity}</span>
                    </p>
                    <p>
                      Date:{" "}
                      <span className="text-gray-500">
                        {new Date(item.date).toDateString()}
                      </span>
                    </p>
                  </div>
                  <div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        item.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : item.status === "ORDERED"
                          ? "bg-blue-100 text-blue-700"
                          : item.status === "DELIVERED"
                          ? "bg-green-100 text-green-700"
                          : item.status === "CANCELLED"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        item.paymentMethod === "cod"
                          ? "bg-gray-200 text-gray-700"
                          : item.paymentMethod === "Razorpay"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {item.paymentMethod || "N/A"}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button className="w-24 h-10 bg-blue-600 text-white rounded-md text-sm shadow-md hover:bg-blue-500 transition">
                      Track Order
                    </button>
                    <button
                      className="w-24 h-10 bg-red-600 text-white rounded-md text-sm shadow-md hover:bg-red-500 transition"
                      onClick={() => handleCancel(item.orderId)}
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              ))}

            {/* Service Orders */}
            <div className="min-h-[40rem] bg-white border rounded-lg overflow-auto">
            {view === "services" &&
  serviceCart.map(
    (serviceItem, index) =>
      (serviceItem.status === "COMPLETED" || serviceItem.status === "CANCELLED") && (
        <div key={serviceItem._id} className="mb-8 border rounded-lg shadow-sm overflow-hidden">
          {/* Service Header */}
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Service #{index + 1}</h3>
                <p className="text-sm text-gray-500">Completed on {new Date(serviceItem.completedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-4 items-center">
                <div>
                  <span className="font-semibold">Total:</span> ₹ {serviceItem.price}
                </div>
                <div>
                  {serviceItem.paymentStatus === "PENDING" ? (
                    <button
                      onClick={() => handlePayment(serviceItem)}
                      className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      Pay Now
                    </button>
                  ) : (
                    <span
                      className={`px-2 py-1 text-sm font-medium rounded ${
                        serviceItem.paymentStatus === "PAID"
                          ? "bg-green-100 text-green-700"
                          : serviceItem.paymentStatus === "REFUNDED"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {serviceItem.paymentStatus}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Services Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {serviceItem.services.map((service) => (
                  <tr key={service._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {service.serviceId.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {service.serviceId.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {service.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹ {service.serviceId.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {service.serviceId.estimatedDuration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* More Info Expansion Panel */}
          <div className="p-4 border-t">
            <button
              onClick={() => toggleRow(serviceItem._id)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border rounded-md hover:bg-gray-200 focus:outline-none"
            >
              {expandedRow === serviceItem._id
                ? "Less Info"
                : "More Info"}{" "}
              {expandedRow === serviceItem._id ? (
                <ChevronUp />
              ) : (
                <ChevronDown />
              )}
            </button>

            {expandedRow === serviceItem._id && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  {/* Scheduled Date and Time */}
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-700">
                      Scheduled Date
                    </span>
                    <p className="text-gray-600">
                      {new Date(
                        serviceItem.scheduledFor
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-700">
                      Scheduled Time
                    </span>
                    <p className="text-gray-600">
                      {new Date(
                        serviceItem.scheduledFor
                      ).toLocaleTimeString()}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-700">
                      Status
                    </span>
                    <span
                      className={`px-2 py-1 mt-1 text-sm font-medium text-center rounded-md ${
                        serviceItem.status === "CREATED"
                          ? "bg-gray-200 text-gray-700"
                          : serviceItem.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-700"
                          : serviceItem.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : serviceItem.status === "CANCELLED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {serviceItem.status}
                    </span>
                  </div>

                  {/* Payment Status */}
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-700">
                      Payment Status
                    </span>
                    <span
                      className={`px-2 py-1 mt-1 text-sm font-medium text-center rounded-md ${
                        serviceItem.paymentStatus === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : serviceItem.paymentStatus === "PAID"
                          ? "bg-green-100 text-green-700"
                          : serviceItem.paymentStatus === "REFUNDED"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {serviceItem.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Remarks */}
                {serviceItem.remarks && (
                  <div className="mt-4">
                    <span className="font-semibold text-gray-700">Remarks</span>
                    <p className="mt-1 text-gray-600">{serviceItem.remarks}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex flex-col gap-2">
                  {serviceItem.paymentStatus === "PENDING" && (
                    <button
                      onClick={() => handlePayment(serviceItem)}
                      className="w-full px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    >
                      Pay Now
                    </button>
                  )}
                  
                  {/* <button
                    onClick={() => openPDF(`/rate_charts/ac_rate_chart.pdf`)}
                    className="w-full px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  >
                    View Rate Chart
                  </button> */}
                </div>
              </div>
            )}
          </div>
        </div>
      )
  )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;

// import React, { useContext, useEffect, useState } from 'react'
// import { ShopContext } from '../context/ShopContext'
// import Title from '../components/Title';
// import axios from 'axios';
// import AuthContext from '../context/AuthContext';
// import Loading from '../components/Loading';
// import { toast } from 'react-toastify';

// const Orders = () => {

//   const { backendUrl, token , currency} = useContext(ShopContext);
//   const { user, loading } = useContext(AuthContext);
//   const [ ordersLoading, setOrdersLoading ] = useState(true);

//   const [orderData,setorderData] = useState([])

//   const loadOrderData = async () => {
//     setOrdersLoading(true);
//     try {
//       if (!token) {
//         return null
//       }

//       const response = await axios.post(backendUrl + '/api/order/userorders',{userId: user._id},{headers:{ Authorization: `Bearer ${token}` }});
//       console.log('order response: ', response);
//       if (response.data.success) {
//         let allOrdersItem = []
//         response.data.orders.map((order)=>{
//           order.products.map((item)=>{
//             item['status'] = order.status
//             // item['payment'] = order.payment
//             item['paymentMethod'] = order.paymentDetails.method
//             item['date'] = order.updatedAt
//             allOrdersItem.push(item)
//           })
//         })
//         setorderData(allOrdersItem.reverse())
//         console.log('order data: ', orderData);
//       }

//     } catch (error) {
//       toast.error('Something went wrong');
//       console.error('Error while fetching orders: ', error);
//     }finally{
//       setOrdersLoading(false);
//     }
//   }

//   useEffect(()=>{
//     loadOrderData()
//   },[])

//   if(loading || ordersLoading) return (<Loading/>);

//   return (
//     <div className="border-t pt-16 min-h-screen">
//       {/* Page Title */}
//       <div className="text-3xl font-bold text-gray-800 mb-6">
//         <Title text1="MY" text2="ORDERS" />
//       </div>

//       {/* Order Table */}
//       <div className="container mx-auto px-4">
//         <div className="bg-white shadow-md rounded-lg overflow-hidden">
//           {/* Scrollable Table Body */}
//           <div className="max-h-[40rem] overflow-y-auto">
//             {/* Table Headers */}
//             <div
//               className="grid grid-cols-6 gap-4 bg-gray-100 py-3 px-4 text-gray-600 text-sm font-semibold sticky top-0 z-10"
//             >
//               <div>Image</div>
//               <div>Product Name</div>
//               <div>Details</div>
//               <div>Status</div>
//               <div>Payment</div>
//               <div className='text-center'>Actions</div>
//             </div>

//             {/* Order Rows */}
//             {orderData.map((item, index) => (
//               <div
//                 key={index}
//                 className="grid grid-cols-6 gap-4 items-center border-b border-gray-200 py-4 px-4 text-sm"
//               >
//                 {/* Product Image */}
//                 <div>
//                   <img
//                     className="w-16 h-16 object-cover rounded-md"
//                     src={item.thumbnail}
//                     alt={item.product.name || "Product Image"}
//                   />
//                 </div>

//                 {/* Product Name */}
//                 <div>
//                   <p className="font-medium text-gray-900">{item.product.name}</p>
//                 </div>

//                 {/* Product Details */}
//                 <div>
//                   <p>
//                     Price: <span className="font-medium">{currency}{item.price}</span>
//                   </p>
//                   <p>
//                     Quantity: <span className="font-medium">{item.quantity}</span>
//                   </p>
//                   <p>
//                     Date:{" "}
//                     <span className="text-gray-500">
//                       {new Date(item.date).toDateString()}
//                     </span>
//                   </p>
//                 </div>

//                 {/* Status */}
//                 <div>
//                   <span
//                     className={`px-2 py-1 rounded text-xs font-semibold ${
//                       item.status === "PENDING"
//                         ? "bg-yellow-100 text-yellow-700"
//                         : item.status === "ORDERED"
//                         ? "bg-blue-100 text-blue-700"
//                         : item.status === "DELIVERED"
//                         ? "bg-green-100 text-green-700"
//                         : "bg-gray-100 text-gray-500"
//                     }`}
//                   >
//                     {item.status}
//                   </span>
//                 </div>

//                 {/* Payment */}
//                 <div>
//                   <span
//                     className={`px-2 py-1 rounded text-xs font-semibold ${
//                       item.paymentMethod === "cod"
//                         ? "bg-gray-200 text-gray-700"
//                         : item.paymentMethod === "Razorpay"
//                         ? "bg-indigo-100 text-indigo-700"
//                         : "bg-gray-100 text-gray-500"
//                     }`}
//                   >
//                     {item.paymentMethod || "N/A"}
//                   </span>
//                 </div>

//                 <div className="flex gap-3">
//                   {/* Buttons for Ordered + COD */}
//                   {item.status === "ORDERED" && item.paymentMethod.toLowerCase() === "cod" && (
//                     <>
//                       <button
//                         onClick={() => loadOrderData(item._id)}
//                         className="w-24 h-10 bg-blue-600 text-white rounded-md text-sm shadow-md hover:bg-blue-500 transition flex items-center justify-center"
//                       >
//                         Track Order
//                       </button>
//                       <button
//                         onClick={() => cancelOrder(item._id)}
//                         className="w-24 h-10 bg-red-600 text-white rounded-md text-sm shadow-md hover:bg-red-500 transition flex items-center justify-center"
//                       >
//                         Cancel Order
//                       </button>
//                     </>
//                   )}

//                   {/* Buttons for Pending + Razorpay */}
//                   {item.status === "PENDING" && item.paymentMethod.toLowerCase() === "razorpay" && (
//                     <>
//                       <button
//                         onClick={() => completePayment(item._id)}
//                         className="w-24 h-10 bg-green-600 text-white rounded-md text-sm shadow-md hover:bg-green-500 transition flex items-center justify-center"
//                       >
//                         Pay Now
//                       </button>
//                       <button
//                         onClick={() => cancelOrder(item._id)}
//                         className="w-24 h-10 bg-red-600 text-white rounded-md text-sm shadow-md hover:bg-red-500 transition flex items-center justify-center"
//                       >
//                         Cancel Order
//                       </button>
//                     </>
//                   )}

//                   {/* Buttons for Ordered + Razorpay */}
//                   {item.status === "ORDERED" && item.paymentMethod.toLowerCase() === "razorpay" && (
//                     <>
//                       <button
//                         onClick={() => loadOrderData(item._id)}
//                         className="w-24 h-10 bg-blue-600 text-white rounded-md text-sm shadow-md hover:bg-blue-500 transition flex items-center justify-center"
//                       >
//                         Track Order
//                       </button>
//                       <button
//                         onClick={() => cancelOrder(item._id)}
//                         className="w-24 h-10 bg-red-600 text-white rounded-md text-sm shadow-md hover:bg-red-500 transition flex items-center justify-center"
//                       >
//                         Cancel Order
//                       </button>
//                     </>
//                   )}
//                 </div>

//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>

//     // <div className='border-t pt-16'>

//     //     <div className='text-2xl'>
//     //         <Title text1={'MY'} text2={'ORDERS'}/>
//     //     </div>

//     //     <div>
//     //         {
//     //           orderData.map((item,index) => (
//     //             <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
//     //                 <div className='flex items-start gap-6 text-sm'>
//     //                     <img className='w-16 sm:w-20' src={item.thumbnail} alt={`${item.name}`} />
//     //                     <div>
//     //                       <p className='sm:text-base font-medium'>{item.name}</p>
//     //                       <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
//     //                         <p>{currency}{item.price}</p>
//     //                         <p>Quantity: {item.quantity}</p>
//     //                       </div>
//     //                       <p className='mt-1'>Date: <span className=' text-gray-400'>{new Date(item.date).toDateString()}</span></p>
//     //                       <p className='mt-1'>Payment: <span className=' text-gray-400'>{item.paymentMethod}</span></p>
//     //                     </div>
//     //                 </div>
//     //                 <div className='md:w-1/2 flex justify-between'>
//     //                     <div className='flex items-center gap-2'>
//     //                         <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
//     //                         <p className='text-sm md:text-base'>{item.status}</p>
//     //                     </div>
//     //                     <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>
//     //                 </div>
//     //             </div>
//     //           ))
//     //         }
//     //     </div>
//     // </div>
//   )
// }

// export default Orders
