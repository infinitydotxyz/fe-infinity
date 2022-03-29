import { MarketListIdType, MarketListingsBody, OBOrder } from '@infinityxyz/lib/types/core';
import { apiPost } from 'src/utils/apiUtil';

export interface BuyOrderMatch {
  buyOrder: OBOrder;
  sellOrders: OBOrder[];
}

export interface TradeBody {
  buyOrder?: OBOrder;
  sellOrder?: OBOrder;
}

export interface MarketListingsResponse {
  buyOrders: OBOrder[];
  sellOrders: OBOrder[];
  matches: BuyOrderMatch[];
  success: string;
  error: string;
}

export interface TradeResponse {
  matches: BuyOrderMatch[];
  success: string;
  error: string;
}

export const addBuy = async (order: OBOrder): Promise<BuyOrderMatch[]> => {
  try {
    const body: TradeBody = {
      buyOrder: order
    };

    const response = await apiPost(`/u/${order.signerAddress}/market`, { data: body });

    if (response.result) {
      const res: TradeResponse | null = response.result;

      if (res && response.status === 200) {
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

      if (res && response.status === 200) {
        return res.matches;
      }
    }

    console.log('An error occured: sell');
  } catch (err) {
    console.log(err);
  }

  return [];
};

export const marketBuyOrders = async (listId: MarketListIdType): Promise<OBOrder[]> => {
  const body: MarketListingsBody = {
    orderType: 'buyOrders',
    action: 'list',
    listId: listId
  };

  return list(body);
};

export const marketSellOrders = async (listId: MarketListIdType): Promise<OBOrder[]> => {
  const body: MarketListingsBody = {
    orderType: 'sellOrders',
    action: 'list',
    listId: listId
  };

  return list(body);
};

const list = async (body: MarketListingsBody): Promise<OBOrder[]> => {
  const response = await apiPost(`/marketListings`, { data: body });

  if (response.result) {
    const match: MarketListingsResponse | null = response.result;

    if (response.status === 200) {
      if (match) {
        if (body.orderType === 'buyOrders') {
          const buys: OBOrder[] = match.buyOrders as OBOrder[];

          return buys;
        } else if (body.orderType === 'sellOrders') {
          const sells: OBOrder[] = match.sellOrders as OBOrder[];

          return sells;
        }
      }
    }
  }
  console.log('An error occured: buy');
  return [];
};

export const marketMatches = async (): Promise<BuyOrderMatch[]> => {
  const body: MarketListingsBody = {
    action: 'match',
    orderType: 'buyOrders'
  };

  const response = await apiPost(`/marketListings`, { data: body });

  if (response.result) {
    const res: MarketListingsResponse | null = response.result;

    if (res && response.status === 200) {
      return res.matches;
    }
  }
  console.log('An error occured: matches');

  return [];
};

export const marketDeleteOrder = async (body: MarketListingsBody): Promise<string> => {
  const response = await apiPost(`/marketListings`, { data: body });

  if (response.result) {
    const match: MarketListingsResponse | null = response.result;

    if (response.status === 200) {
      if (match) {
        return match.success;
      }
    }
  }

  console.log('An error occured: buy');

  return 'error';
};

export const executeBuyOrder = async (orderId: string): Promise<string> => {
  const body: MarketListingsBody = {
    action: 'buy',
    orderId: orderId,
    orderType: 'buyOrders'
  };

  const response = await apiPost(`/marketListings`, { data: body });

  if (response.result) {
    const match: MarketListingsResponse | null = response.result;

    if (response.status === 200) {
      if (match) {
        return match.success;
      }
    }
  }

  console.log('An error occured: buy');

  return 'error';
};

// ======================================================

export interface CollectionAddr {
  address: string;
  name: string;
}

const collectionMap = new Map<string, CollectionAddr>();
collectionMap.set('0xAddress1', { address: '0xAddress1', name: 'Dump Trux' });
collectionMap.set('0xAddress2', { address: '0xAddress2', name: 'Ape People' });
collectionMap.set('0xAddress3', { address: '0xAddress3', name: 'DigiKraap' });
collectionMap.set('0xAddress4', { address: '0xAddress4', name: 'Sik Art' });
collectionMap.set('0xAddress5', { address: '0xAddress5', name: 'Blu Balz' });
collectionMap.set('0xAddress6', { address: '0xAddress6', name: 'Unkle Fester' });
collectionMap.set('0xAddress7', { address: '0xAddress7', name: 'Badass Pix' });

export class CollectionManager {
  static collections = () => Array.from(collectionMap.values());
}
