import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import { use } from 'react';
import AuthContext from '../context/AuthContext';

const CartTotal = () => {
    const {currency,delivery_fee,getCartAmount, backendUrl} = useContext(ShopContext);
    const {user} = useContext(AuthContext);
    const [totalAmount, setTotalAmount] = useState(0);
  
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
          setTotalAmount(response.data.cartData.totalAmount);
        }catch(err){
          console.error('Error while fetching cart items: ', err);
        }
      }
  
      fetchCartDetails();
    },[])

  return (
    <div className='w-full'>
      <div className='text-2xl'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className='flex flex-col gap-2 mt-2 text-sm'>
            <div className='flex justify-between'>
                <p>Subtotal</p>
                <p>{currency} {totalAmount}.00</p>
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
                <b>{currency} {totalAmount === 0 ? 0 : totalAmount + delivery_fee}.00</b>
            </div>
      </div>
    </div>
  )
}

export default CartTotal
