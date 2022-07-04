import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
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

export const fetchOrderNonce = async (user: string): Promise<number> => {
  try {
    const response = await apiGet(`/orders/${user}/nonce`, {});
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
