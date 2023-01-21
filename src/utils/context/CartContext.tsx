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

type CartItem = ERC721CollectionCartItem | ERC721TokenCartItem | ERC721OrderCartItem;

type CartContextType = {
  cartType: CartType;
  setCartType: (cartType: CartType) => void;
  getCartItemsForCartType: (cartType: CartType) => CartItem[];
  setCartItems: (cartItems: CartItem[]) => void;
};

const CartContext = React.createContext<CartContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export const CartContextProvider = ({ children }: Props) => {
  const [cartType, setCartType] = useState<CartType>(CartType.CollectionOffer);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const getCartItemsForCartType = (cartType: CartType) => {
    return cartItems.filter((cartItem) => cartItem.cartType === cartType);
  };

  const value: CartContextType = {
    cartType,
    setCartType,
    getCartItemsForCartType,
    setCartItems
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = (): CartContextType => {
  return useContext(CartContext) as CartContextType;
};
