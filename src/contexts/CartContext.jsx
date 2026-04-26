import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      // 1. Megkeressük az egyedi azonosítót (vagy productId, vagy id)
      const newProductId = product.productId || product.id;

      // 2. Csak akkor keressük meg, ha a TERMÉK ID-je egyezik, nem a kategóriáé!
      const existingItem = prevCart.find((item) => {
        const currentId = item.product.productId || item.product.id;
        return currentId === newProductId;
      });

      if (existingItem) {
        // Ha pontosan ugyanazt a terméket adjuk hozzá, csak a mennyiség nő
        return prevCart.map((item) => {
          const currentId = item.product.productId || item.product.id;
          return currentId === newProductId
            ? { ...item, quantity: item.quantity + quantity }
            : item;
        });
      }

      // Ha ez egy új termék (még ha ugyanaz is a kategóriája), új sorként adjuk hozzá
      return [...prevCart, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => (item.product.productId || item.product.id) !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        (item.product.productId || item.product.id) === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };
  
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
