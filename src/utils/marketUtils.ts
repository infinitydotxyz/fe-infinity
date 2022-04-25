import { SignedOBOrder } from '@infinityxyz/lib/types/core';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { apiPost, isStatusOK } from 'src/utils/apiUtils';
import { apiGet } from '.';

export const postOrders = async (user: string, orders: SignedOBOrder[]) => {
  try {
    const body = {
      orders: orders
    };

    const response = await apiPost(`/orders/${user}/create`, {
      data: body,
      options: { headers: { 'Content-Type': 'application/json' } }
    });
    if (response.result) {
      const res = response.result;
      if (res && isStatusOK(response)) {
        console.log('Orders sent successfully');
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const getOrders = async (): Promise<SignedOBOrder[]> => {
  const response = await apiGet(`/orders/get`, {});

  if (response.result) {
    return response.result as SignedOBOrder[];
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

export const bigNumToDate = (time: BigNumberish): Date => {
  return new Date(BigNumber.from(time).toNumber() * 1000);
};
