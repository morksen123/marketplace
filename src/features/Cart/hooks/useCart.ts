import { Product } from '@/features/ProductListing/constants';
import { cartQuantityAtom } from '@/store/cartAtom';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { CartItem } from '../types/cart';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [, setCartQuantityAtom] = useAtom(cartQuantityAtom);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    setCartQuantityAtom(cartQuantity);
  }, [cart, setCartQuantityAtom]);

  const addToCart = (product: Product, quantity: number) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === product.productId,
      );
      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [
        ...currentCart,
        {
          imageUrl: product.productPictures[0],
          id: product.productId,
          name: product.listingTitle,
          price: product.price,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId),
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item,
      ),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartPrice,
  };
};
