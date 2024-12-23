import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';

const Orders = () => {

  const { backendUrl, token , currency} = useContext(ShopContext);
  const { user, loading } = useContext(AuthContext);
  const [ ordersLoading, setOrdersLoading ] = useState(true);

  const [orderData,setorderData] = useState([])

  const loadOrderData = async () => {
    setOrdersLoading(true);
    try {
      if (!token) {
        return null
      }

      const response = await axios.post(backendUrl + '/api/order/userorders',{userId: user._id},{headers:{ Authorization: `Bearer ${token}` }});
      console.log('order response: ', response);
      if (response.data.success) {
        let allOrdersItem = []
        response.data.orders.map((order)=>{
          order.products.map((item)=>{
            item['status'] = order.status
            // item['payment'] = order.payment
            item['paymentMethod'] = order.paymentDetails.method
            item['date'] = order.updatedAt
            allOrdersItem.push(item)
          })
        })
        setorderData(allOrdersItem.reverse())
        console.log('order data: ', orderData);
      }
      
    } catch (error) {
      toast.error('Something went wrong');
      console.error('Error while fetching orders: ', error);
    }finally{
      setOrdersLoading(false);
    }
  }

  useEffect(()=>{
    loadOrderData()
  },[])

  if(loading | ordersLoading) return (<Loading/>);

  return (
    <div className="border-t pt-16 min-h-screen">
      {/* Page Title */}
      <div className="text-3xl font-bold text-gray-800 mb-6">
        <Title text1="MY" text2="ORDERS" />
      </div>

      {/* Order Table */}
      <div className="container mx-auto px-4">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Scrollable Table Body */}
          <div className="max-h-[40rem] overflow-y-auto">
            {/* Table Headers */}
            <div
              className="grid grid-cols-6 gap-4 bg-gray-100 py-3 px-4 text-gray-600 text-sm font-semibold sticky top-0 z-10"
            >
              <div>Image</div>
              <div>Product Name</div>
              <div>Details</div>
              <div>Status</div>
              <div>Payment</div>
              <div className=' text-center'>Actions</div>
            </div>

            {/* Order Rows */}
            {orderData.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-6 gap-4 items-center border-b border-gray-200 py-4 px-4 text-sm"
              >
                {/* Product Image */}
                <div>
                  <img
                    className="w-16 h-16 object-cover rounded-md"
                    src={item.thumbnail}
                    alt={item.name || "Product Image"}
                  />
                </div>

                {/* Product Name */}
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                </div>

                {/* Product Details */}
                <div>
                  <p>
                    Price: <span className="font-medium">{currency}{item.price}</span>
                  </p>
                  <p>
                    Quantity: <span className="font-medium">{item.quantity}</span>
                  </p>
                  <p>
                    Date:{" "}
                    <span className="text-gray-500">
                      {new Date(item.date).toDateString()}
                    </span>
                  </p>
                </div>

                {/* Status */}
                <div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      item.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : item.status === "ORDERED"
                        ? "bg-blue-100 text-blue-700"
                        : item.status === "DELIVERED"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Payment */}
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
                  {/* Buttons for Ordered + COD */}
                  {item.status === "ORDERED" && item.paymentMethod.toLowerCase() === "cod" && (
                    <>
                      <button
                        onClick={() => loadOrderData(item._id)}
                        className="w-24 h-10 bg-blue-600 text-white rounded-md text-sm shadow-md hover:bg-blue-500 transition flex items-center justify-center"
                      >
                        Track Order
                      </button>
                      <button
                        onClick={() => cancelOrder(item._id)}
                        className="w-24 h-10 bg-red-600 text-white rounded-md text-sm shadow-md hover:bg-red-500 transition flex items-center justify-center"
                      >
                        Cancel Order
                      </button>
                    </>
                  )}

                  {/* Buttons for Pending + Razorpay */}
                  {item.status === "PENDING" && item.paymentMethod.toLowerCase() === "razorpay" && (
                    <>
                      <button
                        onClick={() => completePayment(item._id)}
                        className="w-24 h-10 bg-green-600 text-white rounded-md text-sm shadow-md hover:bg-green-500 transition flex items-center justify-center"
                      >
                        Pay Now
                      </button>
                      <button
                        onClick={() => cancelOrder(item._id)}
                        className="w-24 h-10 bg-red-600 text-white rounded-md text-sm shadow-md hover:bg-red-500 transition flex items-center justify-center"
                      >
                        Cancel Order
                      </button>
                    </>
                  )}

                  {/* Buttons for Ordered + Razorpay */}
                  {item.status === "ORDERED" && item.paymentMethod.toLowerCase() === "razorpay" && (
                    <>
                      <button
                        onClick={() => loadOrderData(item._id)}
                        className="w-24 h-10 bg-blue-600 text-white rounded-md text-sm shadow-md hover:bg-blue-500 transition flex items-center justify-center"
                      >
                        Track Order
                      </button>
                      <button
                        onClick={() => cancelOrder(item._id)}
                        className="w-24 h-10 bg-red-600 text-white rounded-md text-sm shadow-md hover:bg-red-500 transition flex items-center justify-center"
                      >
                        Cancel Order
                      </button>
                    </>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>



    // <div className='border-t pt-16'>

    //     <div className='text-2xl'>
    //         <Title text1={'MY'} text2={'ORDERS'}/>
    //     </div>

    //     <div>
    //         {
    //           orderData.map((item,index) => (
    //             <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
    //                 <div className='flex items-start gap-6 text-sm'>
    //                     <img className='w-16 sm:w-20' src={item.thumbnail} alt={`${item.name}`} />
    //                     <div>
    //                       <p className='sm:text-base font-medium'>{item.name}</p>
    //                       <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
    //                         <p>{currency}{item.price}</p>
    //                         <p>Quantity: {item.quantity}</p>
    //                       </div>
    //                       <p className='mt-1'>Date: <span className=' text-gray-400'>{new Date(item.date).toDateString()}</span></p>
    //                       <p className='mt-1'>Payment: <span className=' text-gray-400'>{item.paymentMethod}</span></p>
    //                     </div>
    //                 </div>
    //                 <div className='md:w-1/2 flex justify-between'>
    //                     <div className='flex items-center gap-2'>
    //                         <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
    //                         <p className='text-sm md:text-base'>{item.status}</p>
    //                     </div>
    //                     <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>
    //                 </div>
    //             </div>
    //           ))
    //         }
    //     </div>
    // </div>
  )
}

export default Orders
