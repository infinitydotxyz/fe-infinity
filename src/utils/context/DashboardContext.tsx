import {
  BaseCollection,
  ChainId,
  ERC721CardData,
  OBOrder,
  OBOrderItem,
  OBTokenInfo,
  SignedOBOrder
} from '@infinityxyz/lib-frontend/types/core';
import { Erc721Collection } from '@infinityxyz/lib-frontend/types/core/Collection';
import { getOBComplicationAddress, getTxnCurrencyAddress } from '@infinityxyz/lib-frontend/utils';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { CollectionTokenCache, TokenFetcherAlt } from 'src/components/astra/token-grid/token-fetcher';
import { useCardSelection } from 'src/components/astra/useCardSelection';
import { useCollectionSelection } from 'src/components/astra/useCollectionSelection';
import { toastError, toastSuccess } from 'src/components/common';
import { getEstimatedGasPrice } from '../commonUtils';
import { DEFAULT_MAX_GAS_PRICE_WEI } from '../constants';
import { getSignedOBOrder } from '../exchange/orders';
import { useOnboardContext } from '../OnboardContext/OnboardContext';
import { fetchOrderNonce, postOrdersV2 } from '../orderbookUtils';
import { weekSeconds } from '../ui-constants';

export type DashboardContextType = {
  collection: BaseCollection | undefined;
  setCollection: (value: BaseCollection) => void;

  gridWidth: number;
  setGridWidth: (value: number) => void;

  displayName: string;
  setDisplayName: (value: string) => void;

  showCart: boolean;
  setShowCart: (value: boolean) => void;

  listMode: boolean;
  setListMode: (value: boolean) => void;

  numTokens: number;
  setNumTokens: (value: number) => void;

  tokenFetcher: TokenFetcherAlt | undefined;
  setTokenFetcher: (value: TokenFetcherAlt | undefined) => void;

  handleTokenCheckout: (selection: ERC721CardData[]) => Promise<void>;
  handleCollCheckout: (selection: Erc721Collection[]) => Promise<void>;
  refreshData: () => void;
  refreshTrigger: number;

  toggleSelection: (data: ERC721CardData) => void;
  isSelected: (data: ERC721CardData) => boolean;
  isSelectable: (data: ERC721CardData) => boolean;
  removeFromSelection: (data?: ERC721CardData) => void;
  selection: ERC721CardData[];
  clearSelection: () => void;

  toggleCollSelection: (data: Erc721Collection) => void;
  isCollSelected: (data: Erc721Collection) => boolean;
  isCollSelectable: (data: Erc721Collection) => boolean;
  removeCollFromSelection: (data?: Erc721Collection) => void; // null to remove all
  collSelection: Erc721Collection[];
  clearCollSelection: () => void;
};

const DashboardContext = React.createContext<DashboardContextType | null>(null);

interface Props {
  children: ReactNode;
}

export const DashboardContextProvider = ({ children }: Props) => {
  const [collection, setCollection] = useState<BaseCollection>();
  const [showCart, setShowCart] = useState(true);
  const [numTokens, setNumTokens] = useState(0);
  const [tokenFetcher, setTokenFetcher] = useState<TokenFetcherAlt | undefined>();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [gridWidth, setGridWidth] = useState(0);
  const [listMode, setListMode] = useState(false);

  const [displayName, setDisplayName] = useState<string>('');

  const { getSigner, getEthersProvider, user, chainId } = useOnboardContext();

  const { isSelected, isSelectable, toggleSelection, clearSelection, selection, removeFromSelection } =
    useCardSelection();

  const {
    isCollSelected,
    isCollSelectable,
    toggleCollSelection,
    clearCollSelection,
    collSelection,
    removeCollFromSelection
  } = useCollectionSelection();

  useEffect(() => {
    refreshData();
  }, []);

  const handleTokenCheckout = async (tokens: ERC721CardData[]) => {
    const signer = getSigner();
    if (!user || !user.address || !signer) {
      toastError('No logged in user');
    } else {
      // sign orders
      const signedOrders: SignedOBOrder[] = [];
      let orderNonce = await fetchOrderNonce(user.address);
      for (const token of tokens) {
        const order = await tokenToOBOrder(token, orderNonce);
        orderNonce += 1;
        if (order) {
          try {
            const signedOrder = await getSignedOBOrder(user, chainId, signer, order);
            if (signedOrder) {
              signedOrders.push(signedOrder);
            }
          } catch (ex) {
            console.error(ex);
            toastError(`${ex}`);
          }
        }
      }

      // post orders
      try {
        await postOrdersV2(chainId as ChainId, signedOrders);
        toastSuccess('Orders posted');
      } catch (ex) {
        console.error(ex);
        toastError(`${ex}}`);
      }
    }
  };

  const handleCollCheckout = async (collections: Erc721Collection[]) => {
    const signer = getSigner();
    if (!user || !user.address || !signer) {
      toastError('No logged in user');
    } else {
      // sign orders
      const signedOrders: SignedOBOrder[] = [];
      let orderNonce = await fetchOrderNonce(user.address);
      for (const collection of collections) {
        const order = await collectionToOBOrder(collection, orderNonce);
        orderNonce += 1;
        if (order) {
          try {
            const signedOrder = await getSignedOBOrder(user, chainId, signer, order);
            if (signedOrder) {
              signedOrders.push(signedOrder);
            }
          } catch (ex) {
            console.error(ex);
            toastError(`${ex}`);
          }
        }
      }

      // post orders
      try {
        await postOrdersV2(chainId as ChainId, signedOrders);
        toastSuccess('Orders posted');
      } catch (ex) {
        console.error(ex);
        toastError(`${ex}}`);
      }
    }
  };

  const tokenToOBOrder = async (token: ERC721CardData, orderNonce: number): Promise<OBOrder | undefined> => {
    try {
      const currencyAddress = getTxnCurrencyAddress(chainId);
      const gasPrice = await getEstimatedGasPrice(getEthersProvider());
      const obTokenInfo: OBTokenInfo = {
        tokenId: token.tokenId ?? '',
        tokenName: token.name ?? '',
        tokenImage: token.image ?? token.cardImage ?? token.imagePreview ?? '',
        numTokens: 1, // always 1 for ERC721
        takerAddress: '',
        takerUsername: '',
        attributes: token.attributes ?? []
      };
      const obOrderItem: OBOrderItem = {
        chainId: token.chainId as ChainId,
        collectionAddress: token.address ?? '',
        collectionName: token.collectionName ?? '',
        collectionImage: '',
        collectionSlug: token.collectionSlug ?? '',
        hasBlueCheck: token.hasBlueCheck ?? false,
        tokens: [obTokenInfo]
      };
      const order: OBOrder = {
        id: '',
        chainId: token.chainId ?? '1',
        isSellOrder: false, // orders are always buys in this release
        makerAddress: user?.address ?? '',
        numItems: 1, // defaulting to one for now; m of n orders not supported in this release via FE
        startTimeMs: Date.now(),
        endTimeMs: Date.now() + weekSeconds * 1000, // default one week todo: get from FE
        startPriceEth: 1, // defaulting to 1 ETH for now todo: get from FE
        endPriceEth: 1, // defaulting to 1 ETH for now
        nfts: [obOrderItem],
        makerUsername: '', // filled in BE
        nonce: orderNonce,
        maxGasPriceWei: gasPrice ?? DEFAULT_MAX_GAS_PRICE_WEI,
        execParams: {
          currencyAddress,
          complicationAddress: getOBComplicationAddress(chainId)
        },
        extraParams: {
          buyer: ''
        }
      };
      return order;
    } catch (err) {
      console.log(err);
    }
  };

  const collectionToOBOrder = async (
    collection: Erc721Collection,
    orderNonce: number
  ): Promise<OBOrder | undefined> => {
    try {
      const currencyAddress = getTxnCurrencyAddress(chainId);
      const gasPrice = await getEstimatedGasPrice(getEthersProvider());
      const obOrderItem: OBOrderItem = {
        chainId: collection.chainId as ChainId,
        collectionAddress: collection.address,
        collectionName: collection.metadata.name,
        collectionImage: collection.metadata.profileImage,
        collectionSlug: collection.slug,
        hasBlueCheck: collection.hasBlueCheck,
        tokens: []
      };
      const order: OBOrder = {
        id: '',
        chainId: collection.chainId,
        isSellOrder: false, // collection orders are always buys
        makerAddress: user?.address ?? '',
        numItems: 1, // defaulting to one for now; m of n orders not supported in this release via FE
        startTimeMs: Date.now(),
        endTimeMs: Date.now() + weekSeconds * 1000, // default one week todo: get from FE
        startPriceEth: 1, // defaulting to 1 ETH for now todo: get from FE
        endPriceEth: 1, // defaulting to 1 ETH for now
        nfts: [obOrderItem],
        makerUsername: '', // filled in BE
        nonce: orderNonce,
        maxGasPriceWei: gasPrice ?? DEFAULT_MAX_GAS_PRICE_WEI,
        execParams: {
          currencyAddress,
          complicationAddress: getOBComplicationAddress(chainId)
        },
        extraParams: {
          buyer: ''
        }
      };
      return order;
    } catch (err) {
      console.log(err);
    }
  };

  const refreshData = () => {
    CollectionTokenCache.shared().refresh();

    // updating fetchers triggers rebuild
    setRefreshTrigger(refreshTrigger + 1);
  };

  const value: DashboardContextType = {
    collection,
    setCollection,

    gridWidth,
    setGridWidth,

    showCart,
    setShowCart,

    listMode,
    setListMode,

    numTokens,
    setNumTokens,

    tokenFetcher,
    setTokenFetcher,

    handleTokenCheckout,
    handleCollCheckout,
    refreshData,
    refreshTrigger,

    // collection name, my nfts, pending etc
    setDisplayName,
    displayName,

    isSelected,
    isSelectable,
    toggleSelection,
    clearSelection,
    selection,
    removeFromSelection,

    isCollSelected,
    isCollSelectable,
    toggleCollSelection,
    clearCollSelection,
    collSelection,
    removeCollFromSelection
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

export const useDashboardContext = (): DashboardContextType => {
  return useContext(DashboardContext) as DashboardContextType;
};
