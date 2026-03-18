'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext({});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const addToCart = (item, type = 'tour') => {
    const newCart = [...cart];
    const existingItem = newCart.find(
      (i) => i.id === item.id && i.type === type
    );

    if (existingItem) {
      existingItem.quantity += 1;
      toast.success('Item quantity updated in cart');
    } else {
      newCart.push({
        ...item,
        type,
        quantity: 1,
        addedAt: new Date().toISOString(),
      });
      toast.success('Item added to cart');
    }

    saveCart(newCart);
  };

  const removeFromCart = (itemId, type) => {
    const newCart = cart.filter((item) => !(item.id === itemId && item.type === type));
    saveCart(newCart);
    toast.success('Item removed from cart');
  };

  const updateQuantity = (itemId, type, quantity) => {
    if (quantity < 1) {
      removeFromCart(itemId, type);
      return;
    }

    const newCart = cart.map((item) =>
      item.id === itemId && item.type === type
        ? { ...item, quantity }
        : item
    );
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
    toast.success('Cart cleared');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.price || item.base_price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        cartCount: getCartCount(),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};