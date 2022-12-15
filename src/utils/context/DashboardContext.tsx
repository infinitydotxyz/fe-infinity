import { toastError, toastSuccess } from 'src/components/common';
import { CollectionTokenCache, TokenFetcherAlt } from 'src/components/astra/token-grid/token-fetcher';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { useCardSelection } from 'src/components/astra/useCardSelection';
import { useOnboardContext } from '../OnboardContext/OnboardContext';
import { ERC721CardData } from '@infinityxyz/lib-frontend/types/core';
import { CollectionInfo } from '../astra-utils';

export type DashboardContextType = {
  collection: CollectionInfo | undefined;
  setCollection: (value: CollectionInfo) => void;

  gridWidth: number;
  setGridWidth: (value: number) => void;

  displayName: string;
  setDisplayName: (value: string) => void;

  showCart: boolean;
  setShowCart: (value: boolean) => void;

  showCollections: boolean;
  setShowCollections: (value: boolean) => void;

  listMode: boolean;
  setListMode: (value: boolean) => void;

  numTokens: number;
  setNumTokens: (value: number) => void;

  tokenFetcher: TokenFetcherAlt | undefined;
  setTokenFetcher: (value: TokenFetcherAlt | undefined) => void;

  handleCheckout: (selection: ERC721CardData[]) => void;
  refreshData: () => void;
  refreshTrigger: number;

  toggleSelection: (data: ERC721CardData) => void;
  isSelected: (data: ERC721CardData) => boolean;
  isSelectable: (data: ERC721CardData) => boolean;
  removeFromSelection: (data?: ERC721CardData) => void;
  selection: ERC721CardData[];
  clearSelection: () => void;
};

const DashboardContext = React.createContext<DashboardContextType | null>(null);

interface Props {
  children: ReactNode;
}

export const DashboardContextProvider = ({ children }: Props) => {
  const [collection, setCollection] = useState<CollectionInfo>();
  const [showCart, setShowCart] = useState(true);
  const [showCollections, setShowCollections] = useState(false);
  const [numTokens, setNumTokens] = useState(0);
  const [tokenFetcher, setTokenFetcher] = useState<TokenFetcherAlt | undefined>();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [gridWidth, setGridWidth] = useState(0);
  const [listMode, setListMode] = useState(false);

  const [displayName, setDisplayName] = useState<string>('');

  const { user } = useOnboardContext();

  const { isSelected, isSelectable, toggleSelection, clearSelection, selection, removeFromSelection } =
    useCardSelection();

  useEffect(() => {
    refreshData();
  }, []);

  const handleCheckout = (selection: ERC721CardData[]) => {
    if (user) {
      console.log(selection);
      toastSuccess('Your order has been submitted');
    } else {
      toastError('Something went wrong');
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

    showCollections,
    setShowCollections,

    listMode,
    setListMode,

    numTokens,
    setNumTokens,

    tokenFetcher,
    setTokenFetcher,

    handleCheckout,
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
    removeFromSelection
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

export const useDashboardContext = (): DashboardContextType => {
  return useContext(DashboardContext) as DashboardContextType;
};
