import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext({});

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cwb360_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    localStorage.setItem('cwb360_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (attraction, category, batch, quantity, visitDate) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(item => 
        item.attractionId === attraction.id && 
        item.categoryId === category.id &&
        item.visitDate === visitDate
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, {
        id: `${attraction.id}-${category.id}-${Date.now()}`,
        attractionId: attraction.id,
        attractionName: attraction.name,
        coverImageUrl: attraction.coverImageUrl,
        categoryId: category.id,
        categoryName: category.name,
        price: batch ? batch.price : attraction.ticketStartingPrice || 0,
        quantity,
        visitDate
      }];
    });
  };

  const removeFromCart = (itemId) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity: newQuantity } : i));
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    localStorage.removeItem('cwb360_cart');
  };

  const subtotal = items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
  const discount = coupon ? (subtotal * (coupon.percentage / 100)) : 0;
  const total = Math.max(0, subtotal - discount);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      coupon,
      setCoupon,
      subtotal,
      discount,
      total,
      count: items.reduce((acc, item) => acc + item.quantity, 0)
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
