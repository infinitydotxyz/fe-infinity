import React, { useContext, useState } from 'react';
import { ERC721CollectionCartItem, ERC721OrderCartItem, ERC721TokenCartItem } from '../types';

export enum CartType {
  CollectionOffer,
  TokenOffer,
  TokenList,
  BuyNow,
  SellNow,
  Send,
  Cancel,
  None
}

export type CartItem = ERC721CollectionCartItem | ERC721TokenCartItem | ERC721OrderCartItem;

type CartContextType = {
  cartType: CartType;
  setCartType: (cartType: CartType) => void;
  getCurrentCartItems: () => CartItem[];
  setCartItemsForCartType: (cartType: CartType, cartItems: CartItem[]) => void;
  cartItems: Map<CartType, CartItem[]>;
};

const CartContext = React.createContext<CartContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export const CartContextProvider = ({ children }: Props) => {
  const [cartType, setCartType] = useState<CartType>(CartType.CollectionOffer);
  const [cartItems, setCartItems] = useState<Map<CartType, CartItem[]>>(new Map());

  const getCurrentCartItems = () => {
    return cartItems.get(cartType) || [];
  };

  const setCartItemsForCartType = (cartType: CartType, cartItems: CartItem[]) => {
    setCartItems((prev) => {
      const newMap = new Map(prev);
      newMap.set(cartType, cartItems);
      return newMap;
    });
  };

  const value: CartContextType = {
    cartType,
    setCartType,
    getCurrentCartItems,
    setCartItemsForCartType,
    cartItems
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = (): CartContextType => {
  return useContext(CartContext) as CartContextType;
};
