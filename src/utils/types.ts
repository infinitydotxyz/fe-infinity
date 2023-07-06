import { ERC721CardData, Erc721Collection, ExecutionStatus, SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { CartType } from './context/CartContext';

export enum OrderBy {
  Price = 'price',
  StartTime = 'startTime',
  EndTime = 'endTime'
}

export const SORT_FILTERS = {
  highestPrice: 'highestPrice',
  lowestPrice: 'lowestPrice',
  mostRecent: 'mostRecent',
  tokenIdNumeric: 'tokenIdNumeric'
};

export const SORT_LABELS: {
  [key: string]: string;
} = {
  [SORT_FILTERS.highestPrice]: 'Highest Price',
  [SORT_FILTERS.lowestPrice]: 'Lowest Price',
  [SORT_FILTERS.mostRecent]: 'Most Recent',
  [SORT_FILTERS.tokenIdNumeric]: 'Token ID'
};

export enum ORDER_EXPIRY_TIME {
  HOUR = '1h',
  DAY = '1d',
  WEEK = '7d',
  MONTH = '30d',
  SIX_MONTHS = '6mo',
  YEAR = '1y'
}

export interface ERC721CollectionCartItem extends Erc721Collection {
  id?: string;
  offerPriceEth?: number;
  offerExpiry?: ORDER_EXPIRY_TIME;
  cartType: CartType.CollectionBid;
  image?: string;
  title?: string;
  source?: {
    id: string;
    domain: string;
    name: string;
    icon: string;
    url: string;
  };
  criteria?: {
    kind: string;
    data: {
      token: {
        tokenId: string;
        name: string;
        image: string;
      };
      collection: {
        id: string;
        name: string;
        image: string;
      };
      attribute: {
        key: string;
        value: string;
      };
    };
  };
}

export interface ERC721TokenCartItem extends ERC721CardData {
  orderPriceEth?: number;
  orderExpiry?: ORDER_EXPIRY_TIME;
  cartType: CartType;
  lastSalePriceEth?: string | number | null | undefined;
  lastSaleTimestamp?: number;
  mintPriceEth?: string | number | null | undefined;
  validFrom?: number;
  validUntil?: number;
  orderSide?: string;
  source?: {
    id: string;
    domain: string;
    name: string;
    icon: string;
    url: string;
  };
  criteria?: {
    kind: string;
    data: {
      token: {
        tokenId: string;
        name: string;
        image: string;
      };
      collection: {
        id: string;
        name: string;
        image: string;
      };
      attribute: {
        key: string;
        value: string;
      };
    };
  };
}

export interface ERC721OrderCartItem extends SignedOBOrder {
  cartType:
    | CartType.Cancel
    | CartType.CollectionBid
    | CartType.TokenBid
    | CartType.CollectionBidIntent
    | CartType.TokenBidIntent
    | CartType.TokenList;
  executionStatus: ExecutionStatus | null;
}

export interface BasicTokenInfo {
  chainId: string;
  collectionAddress: string;
  tokenId: string;
  collectionFloorPrice?: string | number | null | undefined;
  collectionCreator?: string;
  lastSalePriceEth?: string | number | null | undefined;
  mintPriceEth?: string | number | null | undefined;
  orderPriceEth?: number | undefined;
  orderStartTimeMs?: number;
  orderEndTimeMs?: number;
  validFrom?: number;
  validUntil?: number;
  orderSide?: string;
}

export type TokensFilter = {
  sort?: string;
  orderType?: 'listings' | 'bids-placed' | 'intents-placed' | 'offers-received' | 'listing' | 'offer' | '';
  collections?: string[];
  minPrice?: string;
  maxPrice?: string;
  traitTypes?: string[];
  traitValues?: string[];
  orderBy?: string;
  cursor?: string;
  source?: string;
  hideSpam?: boolean;
};

export interface GlobalRewards {
  totalVolumeETH: number;
  totalNumBuys: number;
  last24HrsVolumeETH: number;
  last24HrsNumBuys: number;
}

export const getSortLabel = (key?: string, defaultLabel?: string): string => {
  let result = '';

  if (key) {
    result = SORT_LABELS[key];
  }

  // default if blank
  return result || defaultLabel || SORT_LABELS[SORT_FILTERS.tokenIdNumeric];
};

export interface AggregatedOrders {
  orders: AggregatedOrder[];
}

export interface AggregatedOrder {
  id: string;
  kind: string;
  side: string;
  status: string;
  tokenSetId: string;
  chainId: string;
  contract: string;
  maker: string;
  taker: string;
  lastSalePriceEth: number;
  mintPriceEth: number;
  validFrom: number;
  validUntil: number;
  price: {
    currency: {
      contract: string;
      name: string;
      symbol: string;
      decimals: number;
    };
    amount: {
      raw: string;
      decimal: number;
      usd: number;
      native: number;
    };
    netAmount: {
      raw: string;
      decimal: number;
      usd: number;
      native: number;
    };
  };
  criteria: {
    kind: string;
    data: {
      token: {
        tokenId: string;
        name: string;
        image: string;
      };
      collection: {
        id: string;
        name: string;
        image: string;
      };
      attribute: {
        key: string;
        value: string;
      };
    };
  };
  source: {
    id: string;
    domain: string;
    name: string;
    icon: string;
    url: string;
  };
}

export interface ReservoirUserTopOffers {
  totalAmount: number;
  totalTokensWithBids: number;
  topBids: ReservoirUserTopOffer[];
  continuation: string;
}

export interface ReservoirUserTopOffer {
  id: string;
  chainId: string;
  price: {
    currency: {
      contract: string;
      name: string;
      symbol: string;
      decimals: number;
    };
    amount: {
      raw: string;
      decimal: number;
      usd: number;
      native: number;
    };
    netAmount: {
      raw: string;
      decimal: number;
      usd: number;
      native: number;
    };
  };
  maker: string;
  validFrom: number;
  validUntil: number;
  floorDifferencePercentage: number;
  criteria: {
    kind: string;
    data: {
      token: {
        tokenId: string;
        name: string;
        image: string;
      };
      collection: {
        id: string;
        name: string;
        image: string;
      };
      attribute: {
        key: string;
        value: string;
      };
    };
  };
  source: {
    id: string;
    domain: string;
    name: string;
    icon: string;
    url: string;
  };
  token: {
    contract: string;
    tokenId: string;
    name: string;
    image: string;
    floorAskPrice: number;
    lastSalePrice: {
      currency: {
        contract: string;
        name: string;
        symbol: string;
        decimals: number;
      };
      amount: {
        raw: string;
        decimal: number;
        usd: number;
        native: number;
      };
    };
    collection: {
      id: string;
      name: string;
      imageUrl: string;
      floorAskPrice: {
        currency: {
          contract: string;
          name: string;
          symbol: string;
          decimals: number;
        };
        amount: {
          raw: string;
          decimal: number;
          usd: number;
          native: number;
        };
      };
    };
  };
}

export interface ReservoirTokenV6 {
  token: {
    chainId: string;
    isFlagged?: boolean;
    lastFlagUpdate?: string;
    lastFlagChange?: string | null;
    contract: string;
    tokenId: string;
    name: string;
    description: string;
    image: string;
    kind: string;
    owner: string;
    collection: {
      id: string;
      name: string;
      slug: string;
      image: string;
    };
  };
  market: {
    floorAsk: ReservoirOrderData;
    topBid: ReservoirOrderData;
  };
}

export interface ReservoirOrderData {
  id: string;
  maker: string;
  validFrom: number;
  validUntil: number;
  price: {
    currency: {
      contract: string;
      name: string;
      symbol: string;
      decimals: number;
    };
    amount: {
      raw: string;
      decimal: number;
      usd: number;
      native: number;
    };
    netAmount: {
      raw: string;
      decimal: number;
      usd: number;
      native: number;
    };
  };
  source: {
    id: string;
    domain: string;
    name: string;
    icon: string;
    url: string;
  };
}

export interface ReservoirOrderDepth {
  depth: { price: number; quantity: number }[];
}
