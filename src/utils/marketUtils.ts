import {
  BuyOrderMatch,
  MarketAction,
  MarketListId,
  MarketListingsBody,
  MarketListingsResponse,
  MarketOrder,
  OBOrder,
  TradeBody,
  TradeResponse
} from '@infinityxyz/lib/types/core';
import { BigNumber, BigNumberish } from 'ethers';
import { apiPost, isStatusOK } from 'src/utils/apiUtils';

export const addBuy = async (order: OBOrder): Promise<BuyOrderMatch[]> => {
  try {
    const body: TradeBody = {
      buyOrder: order
    };

    const response = await apiPost(`/u/${order.signerAddress}/market`, { data: body });

    if (response.result) {
      const res: TradeResponse | null = response.result;

      if (res && isStatusOK(response)) {
        return res.matches;
      }
    }
  } catch (err) {
    console.log(err);
  }

  return [];
};

export const addSell = async (order: OBOrder): Promise<BuyOrderMatch[]> => {
  try {
    const body: TradeBody = {
      sellOrder: order
    };

    const response = await apiPost(`/u/${order.signerAddress}/market`, { data: body });
    if (response.result) {
      const res: TradeResponse | null = response.result;

      if (res && isStatusOK(response)) {
        return res.matches;
      }
    }

    console.log('An error occurred: sell');
  } catch (err) {
    console.log(err);
  }

  return [];
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

const list = async (body: MarketListingsBody): Promise<OBOrder[]> => {
  const response = await apiPost(`/market-listings`, { data: body });

  if (response.result) {
    const match: MarketListingsResponse | null = response.result;

    if (isStatusOK(response)) {
      if (match) {
        if (body.orderType === 'buyOrders') {
          const buys: OBOrder[] = match.buyOrders.orders;

          return buys;
        } else if (body.orderType === 'sellOrders') {
          const sells: OBOrder[] = match.sellOrders.orders;

          return sells;
        }
      }
    }
  }
  console.log('An error occured: list');
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

// ======================================================

export interface CollectionAddr {
  id: number;
  address: string;
  name: string;
}

const collectionMap = new Map<string, CollectionAddr>();
collectionMap.set('0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', {
  id: 1,
  address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
  name: 'Dump Trux'
});
collectionMap.set('0xAddress2', { id: 2, address: '0xAddress2', name: 'Ape People' });
collectionMap.set('0xAddress3', { id: 3, address: '0xAddress3', name: 'DigiKraap' });
collectionMap.set('0xAddress4', { id: 4, address: '0xAddress4', name: 'Sik Art' });
collectionMap.set('0xAddress5', { id: 5, address: '0xAddress5', name: 'Blu Balz' });
collectionMap.set('0xAddress6', { id: 6, address: '0xAddress6', name: 'Unkle Fester' });
collectionMap.set('0xAddress7', { id: 7, address: '0xAddress7', name: 'Badass Pix' });

export class CollectionManager {
  static collections = (): CollectionAddr[] => Array.from(collectionMap.values());
}
