import {
  BuyOrderMatch,
  MarketAction,
  MarketListId,
  MarketListingsBody,
  MarketListingsResponse,
  MarketOrder,
  OBOrder,
  SignedOBOrder
} from '@infinityxyz/lib/types/core';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { apiPost, isStatusOK } from 'src/utils/apiUtils';

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
        console.log('Orders posted successfully');
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const marketBuyOrders = async (listId: MarketListId): Promise<OBOrder[]> => {
  const body: MarketListingsBody = {
    orderType: MarketOrder.BuyOrders,
    action: MarketAction.List,
    listId: listId
  };

  return list(body);
};

export const marketSellOrders = async (listId: MarketListId): Promise<OBOrder[]> => {
  const body: MarketListingsBody = {
    orderType: MarketOrder.SellOrders,
    action: MarketAction.List,
    listId: listId
  };

  return list(body);
};

const list = async (body: MarketListingsBody): Promise<SignedOBOrder[]> => {
  const response = await apiPost(`/orders/get`, { data: body });

  if (response.result) {
    return response.result.orders as SignedOBOrder[];
  }

  return [];
};

export const marketMatches = async (): Promise<BuyOrderMatch[]> => {
  const body: MarketListingsBody = {
    action: MarketAction.Match,
    orderType: MarketOrder.BuyOrders
  };

  const response = await apiPost(`/market-listings`, { data: body });

  if (response.result) {
    const res: MarketListingsResponse | null = response.result;

    if (res && isStatusOK(response)) {
      return res.matches;
    }
  }
  console.log('An error occurred: marketMatches');

  return [];
};

export const marketDeleteOrder = async (body: MarketListingsBody): Promise<string> => {
  const response = await apiPost(`/market-listings`, { data: body });

  if (response.result) {
    const match: MarketListingsResponse | null = response.result;

    if (isStatusOK(response)) {
      if (match) {
        return match.success;
      }
    }
  }

  console.log('An error occurred: marketDeleteOrder');

  return 'error';
};

export const deleteOrder = async (orderId: string): Promise<void> => {
  const response = await apiPost(`/orders/delete`, { data: { orderId } });

  if (response.result) {
    console.log(response.result);
  }

  console.log('An error occurred: deleteOrder');
};

export const executeBuyOrder = async (orderId: string): Promise<string> => {
  const body: MarketListingsBody = {
    action: MarketAction.Buy,
    orderId: orderId,
    orderType: MarketOrder.BuyOrders
  };

  const response = await apiPost(`/market-listings`, { data: body });

  if (response.result) {
    const match: MarketListingsResponse | null = response.result;

    if (isStatusOK(response)) {
      if (match) {
        return match.success;
      }
    }
  }

  console.log('An error occurred: executeBuyOrder');

  return 'error';
};

export const bigNumToDate = (time: BigNumberish): Date => {
  return new Date(BigNumber.from(time).toNumber() * 1000);
};
