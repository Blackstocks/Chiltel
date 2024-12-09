import { createContext, useContext, useState, useEffect } from 'react';
import AuthContext from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          category: product.category,
          price: product.discountedPrice,
          name: product.name,
          image: product.image
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      await fetchCart(); // Refresh cart data
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await fetch(`/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove from cart');
      }

      await fetchCart(); // Refresh cart data
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await fetch(`/api/cart/update/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ quantity })
      });

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      await fetchCart(); // Refresh cart data
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    fetchCart
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