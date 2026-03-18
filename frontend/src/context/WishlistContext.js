'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext({});

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveWishlist = (newWishlist) => {
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  const addToWishlist = (item, type = 'tour') => {
    const exists = wishlist.some((i) => i.id === item.id && i.type === type);
    
    if (!exists) {
      const newWishlist = [
        ...wishlist,
        {
          ...item,
          type,
          addedAt: new Date().toISOString(),
        },
      ];
      saveWishlist(newWishlist);
      toast.success('Added to wishlist');
    } else {
      toast.error('Item already in wishlist');
    }
  };

  const removeFromWishlist = (itemId, type) => {
    const newWishlist = wishlist.filter(
      (item) => !(item.id === itemId && item.type === type)
    );
    saveWishlist(newWishlist);
    toast.success('Removed from wishlist');
  };

  const toggleWishlist = (item, type = 'tour') => {
    const exists = wishlist.some((i) => i.id === item.id && i.type === type);
    
    if (exists) {
      removeFromWishlist(item.id, type);
    } else {
      addToWishlist(item, type);
    }
  };

  const isInWishlist = (itemId, type = 'tour') => {
    return wishlist.some((item) => item.id === itemId && item.type === type);
  };

  const clearWishlist = () => {
    saveWishlist([]);
    toast.success('Wishlist cleared');
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};