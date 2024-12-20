import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';
import { toast } from 'react-toastify'

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [cart, setCart] = useState([]);
  const [cartAmount, setCartAmount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [cartLoading, setCartLoading] = useState(false);
  const { isAuthenticated, loading, user } = useContext(AuthContext);

  useEffect(()=>{
    if(isAuthenticated){
      getCartCount(user._id);
    }
  },[loading]);

  useEffect(() => {
    if (isAuthenticated) {
      getCartAmount(user._id);
      getCartCount(user._id);
      fetchCart();
    }
  }, [isAuthenticated, cart]);

  const fetchCart = async () => {
    try {
      setCartLoading(true);
      const response = await fetch('/api/cart', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const cartData = await response.json();
        setCart(cartData);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setCartLoading(false);
    }
  };

  // const addToCart = async (product, quantity = 1) => {
  //   try {
  //     const response = await fetch('/api/cart/add', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${localStorage.getItem('token')}`
  //       },
  //       body: JSON.stringify({
  //         productId: product.id,
  //         quantity,
  //         category: product.category,
  //         price: product.discountedPrice,
  //         name: product.name,
  //         image: product.image
  //       })
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to add to cart');
  //     }

  //     await fetchCart(); // Refresh cart data
  //     return { success: true };
  //   } catch (error) {
  //     return { success: false, error: error.message };
  //   }
  // };

  const addToCart = async (user, item) => {
    const token = localStorage.getItem('token');

    if(!isAuthenticated){
      toast.info('Please log in to add this item into your cart.');
    }else{
      console.log('Item: ',item);
      try{
        const response = await axios.post(backendUrl + '/api/cart/add', {
          userId: user._id,
          itemId: item._id,
          price: item.price * (1 - item.discount),
          name: item.name,
          image: item.thumbnail,
          category: item.category
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Add to cart: ', response.data);
        setCart(response.data.cart);
        console.log('cart is: ', response.data.cart);
        toast.success('Cart updated');
      }catch(err){
        toast.error('Something went wrong')
        console.error('Error while adding item to card: ', err);
      }
      console.log('user: ', user);
    }
}

  // const removeFromCart = async (userId, itemId) => {
  //   console.log(backendUrl);
  //   try {
  //     const response = await axios.post(backendUrl + '/api/cart/remove', {userId, itemId,}, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('token')}`,
  //       }
  //     });
  //     console.log(localStorage.getItem('token'));
  //     console.log(response);
  //     console.log('deleted');
  //     return {sucess: true};

  //   } catch (error) {
  //     console.error(error);
  //     return { success: false, error: error.message };
  //   }
  // };

  const removeFromCart = async (userId, itemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${backendUrl}/api/cart/remove`, 
        { userId, itemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status === 200) {
        getCartAmount(userId);
        setCart(response.data.cartData);
        return { success: true, updatedCart: response.data.cartData }; // Return the updated cart data
      } else {
        throw new Error('Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing item from cart:', error.message);
      return { success: false, error: error.message };
    }
  };
  

  const updateQuantity = async (userId, itemId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${backendUrl}/api/cart/update`, 
        { userId, itemId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status === 200) {
        getCartAmount(userId);
        setCart(response.data.cart);
        return { success: true, updatedCart: response.data.cart };
      } else {
        throw new Error('Failed to remove item from cart');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getCartAmount = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(backendUrl + '/api/cart/get', {
        userId: userId,
      },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartAmount(response.data.cartData.totalAmount);
    }catch(error){
      console.error(error);
      return {success: false, error: error.message};
    }
  }

  const getCartCount = async (userId) => {
    let totalCount = 0;
    let token = localStorage.getItem('token');
    const response = await axios.post(backendUrl + '/api/cart/get', {
        userId,
      },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    const products = response.data.cartData.items;
    for(let item of products) {
        totalCount += item.quantity;
    }
    setCartCount(totalCount);
}

  // const getCartCount = async (userId) => {
  //   try{
  //     const data = await getCartCount(userId);
  //     setCartCount(data);
  //   }catch(err){    
  //       console.error(err);
  //   }
  // }

  const value = {
    cart,
    cartLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    fetchCart,
    cartAmount,
    cartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;