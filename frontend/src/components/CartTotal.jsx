import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import { use } from 'react';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';

const CartTotal = ({amount=null}) => {
    const {currency,delivery_fee,getCartAmount, backendUrl} = useContext(ShopContext);
    const {user, loading} = useContext(AuthContext);
    const [totalAmount, setTotalAmount] = useState(0);
    const {cartAmount} = useContext(CartContext);
  
    // useEffect(()=>{
    //   const token = localStorage.getItem('token');
    //   const fetchCartDetails = async () => {
    //     try{
    //       const response = await axios.post(backendUrl + '/api/cart/get', {
    //         userId: user._id,
    //       },{
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //         },
    //       });
    //       setTotalAmount(response.data.cartData.totalAmount);
    //     }catch(err){
    //       console.error('Error while fetching cart items: ', err);
    //     }
    //   }
      
    //   if(!loading){
    //     fetchCartDetails();
    //   }
    // },[loading])

  return (
    <div className='w-full'>
      <div className='text-2xl'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className='flex flex-col gap-2 mt-2 text-sm'>
            <div className='flex justify-between'>
                <p>Subtotal</p>
                <p>{currency} {amount ? amount : cartAmount}.00</p>
                {/* <p>{currency} {getCartAmount()}.00</p> */}
            </div>
            <hr />
            <div className='flex justify-between'>
                <p>Shipping Fee</p>
                <p>{currency} {delivery_fee}.00</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <b>Total</b>
                <b>{currency} {cartAmount === 0 ? 0 : (amount ? amount : cartAmount) + delivery_fee}.00</b>
            </div>
      </div>
    </div>
  )
}

export default CartTotal
