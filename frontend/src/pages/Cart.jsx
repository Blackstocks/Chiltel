import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import AuthContext from '../context/AuthContext';
import { use } from 'react';
import Loading from '../components/Loading';
import CartContext from '../context/CartContext';

const Cart = () => {

  const {backendUrl} = useContext(ShopContext);
  const {user, loading} = useContext(AuthContext);
  const { products, currency, cartItems, navigate } = useContext(ShopContext);
  const { addToCart, updateQuantity, removeFromCart } = useContext(CartContext);
  const [totalAmount, setTotalAmount] = useState(0);
  const [cartLoading, setCartLoading] = useState(true);

  const [cartData, setCartData] = useState([]);

  useEffect(()=>{
    const token = localStorage.getItem('token');
    const fetchCartDetails = async () => {
      try{
        const response = await axios.post(backendUrl + '/api/cart/get', {
          userId: user._id,
        },{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('my cart data: ',response.data.cartData);
        setCartData(response.data.cartData.items);
        setTotalAmount(response.data.cartData.totalAmount);
      }catch(err){
        console.error('Error while fetching cart items: ', err);
      }finally{
        setCartLoading(false);
      }
    }

    if(!loading){
      fetchCartDetails();
    }
  },[loading])

  // useEffect(() => {

  //   if (products.length > 0) {
  //     const tempData = [];
  //     for (const items in cartItems) {
  //       for (const item in cartItems[items]) {
  //         if (cartItems[items][item] > 0) {
  //           tempData.push({
  //             _id: items,
  //             size: item,
  //             quantity: cartItems[items][item]
  //           })
  //         }
  //       }
  //     }
  //     setCartData(tempData);
  //   }
  // }, [cartItems, products])

  if(cartLoading) return (<Loading />);

  return (
    <div className='border-t pt-14'>

      <div className=' text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div>
        {
          cartData.map((item) => {

            // const productData = products.find((product) => product._id === item._id);

            return (
              <div key={item._id} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                <div className=' flex items-start gap-6'>
                  <img className='w-16 sm:w-20' src={item.image} alt="" />
                  <div>
                    <p className='text-xs sm:text-lg font-medium'>{item.name}</p>
                    <div className='flex items-center gap-5 mt-2'>
                      <p>{currency}{item.price}</p>
                      {/* <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p> */}
                    </div>
                  </div>
                </div>
                {/* <input onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(user._id, item.productId, Number(e.target.value))} className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' type="number" min={1} defaultValue={item.quantity} /> */}
                <input 
                  onChange={(e) => {
                    const newQuantity = Number(e.target.value); // Convert input value to a number
                    if (newQuantity === 0 || isNaN(newQuantity)) return; // Do nothing for invalid values

                    const quantityDifference = newQuantity - item.quantity; // Calculate difference

                    if (quantityDifference !== 0) {
                      updateQuantity(user._id, item.productId, newQuantity); // Call updateQuantity with the new quantity
                    }
                  }} 
                  className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1" 
                  type="number" 
                  min={1} 
                  defaultValue={item.quantity} 
                />
                {/* <input onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))} className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' type="number" min={1} defaultValue={item.quantity} /> */}
                <img
                  onClick={async () => {
                    const result = await removeFromCart(user._id, item.productId);
                    if (result.success) {
                      // Update the cartData state with the new cart data
                      setCartData(result.updatedCart.items);
                      setTotalAmount(result.updatedCart.totalAmount);
                    } else {
                      console.error('Failed to remove item from cart:', result.error);
                    }
                  }}
                  className='w-4 mr-4 sm:w-5 cursor-pointer'
                  src={assets.bin_icon}
                  alt=""
                />
                {/* <img onClick={() => removeFromCart(user._id, item.productId)} className='w-4 mr-4 sm:w-5 cursor-pointer' src={assets.bin_icon} alt="" /> */}
                {/* <img onClick={() => updateQuantity(item._id, item.size, 0)} className='w-4 mr-4 sm:w-5 cursor-pointer' src={assets.bin_icon} alt="" /> */}
              </div>
            )

          })
        }
      </div>

      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal/>
          <div className=' w-full text-end'>
            <button onClick={() => navigate('/place-order')} className='bg-black text-white text-sm my-8 px-8 py-3'>PROCEED TO CHECKOUT</button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Cart
