import { GetOrderItemsQuery, SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { PROTOCOL_FEE_BPS } from '@infinityxyz/lib-frontend/utils';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { apiPost } from 'src/utils/apiUtils';
import { apiGet } from '.';

export const postOrders = async (user: string, orders: SignedOBOrder[]): Promise<string> => {
  try {
    const body = {
      orders: orders
    };

    const { result, error } = await apiPost(`/orders/${user}`, {
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

export const getOrders = async (filters: GetOrderItemsQuery = {}, limit = 5): Promise<SignedOBOrder[]> => {
  const response = await apiGet(`/orders`, {
    query: { ...filters, limit }
  });

  if (response.result) {
    return response.result.data as SignedOBOrder[];
  }

  return [];
};

export const fetchOrderNonce = async (user: string): Promise<string> => {
  try {
    const response = await apiGet(`/orders/${user}/nonce`, {});
    return response.result as string;
  } catch (err) {
    console.error('Failed fetching order nonce');
    throw err;
  }
};

export const fetchMinBpsToSeller = (): number => {
  return 10000 - PROTOCOL_FEE_BPS;
};

export const bigNumToDate = (time: BigNumberish): Date => {
  return new Date(BigNumber.from(time).toNumber() * 1000);
};
