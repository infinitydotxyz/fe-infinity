import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { apiPost } from 'src/utils/apiUtils';
import { apiGet } from '.';
import { User } from './context/AppContext';

export const postOrders = async (user: string, orders: SignedOBOrder[]): Promise<string> => {
  try {
    const body = {
      orders: orders
    };

    const { result, error } = await apiPost(`/orders`, {
      data: body
    });
    if (error) {
      const msg = error?.errorResponse?.message ?? 'postOrders failed.';
      console.error(msg);
      throw msg;
    }
    return result as string;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const fetchOrderNonce = async (user: string): Promise<number> => {
  try {
    const response = await apiGet(`/orders/${user}/nonce`, { requiresAuth: true });
    if (typeof response.result === 'number') {
      return response.result;
    }
    return response.result;
  } catch (err) {
    console.error('Failed fetching order nonce');
    throw err;
  }
};

export const bigNumToDate = (time: BigNumberish): Date => {
  return new Date(BigNumber.from(time).toNumber() * 1000);
};

export const getOrderType = (order: SignedOBOrder): 'Listing' | 'Offer' => {
  return order.isSellOrder ? 'Listing' : 'Offer';
};

// check if an offer made to current user
export const checkOffersToUser = (order: SignedOBOrder, currentUser: User | null) => {
  if (!currentUser) {
    return false;
  }
  let result = false;
  for (const nft of order.nfts) {
    for (const token of nft.tokens) {
      if (token.takerAddress === currentUser.address) {
        result = true;
      }
    }
  }
  return result;
};

export const fetchUserSignedOBOrder = async (orderId: string | undefined) => {
  if (!orderId) {
    return null;
  }
  const { result, error } = await apiGet(`/orders/id/${orderId}`, {
    query: {
      limit: 1
    }
  });
  if (error) {
    throw error;
  }
  if (!error && result) {
    const order = result as SignedOBOrder;
    return order;
  }
  return null;
};
