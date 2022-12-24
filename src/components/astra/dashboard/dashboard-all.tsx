import { CollectionTokenCache } from 'src/components/astra/token-grid/token-fetcher';
import { useEffect } from 'react';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { CenteredContent } from 'src/components/common';
import { ERC721CardData } from '@infinityxyz/lib-frontend/types/core';
import { TokensGrid } from 'src/components/astra/token-grid/token-grid';
import { GridHeader, RouteUtils } from './grid-header';
import { useRouter } from 'next/router';
import { useScrollInfo } from './useScrollHook';
import { OrderbookProvider } from 'src/components/orderbook/OrderbookContext';
import { OrderbookGraph } from 'src/components/orderbook/graph/orderbook-graph';

export const DashboardAll = () => {
  const { setTokenFetcher, collection, refreshTrigger, setDisplayName } = useDashboardContext();

  const { chainId } = useOnboardContext();

  useEffect(() => {
    if (collection && chainId) {
      setTokenFetcher(CollectionTokenCache.shared().fetcher(collection, chainId));

      setDisplayName(collection?.metadata.name ?? '');
    }
  }, [collection, chainId, refreshTrigger]);

  return <DashboardBase />;
};

export const DashboardBase = () => {
  const { setNumTokens, tokenFetcher, isSelected, isSelectable, toggleSelection, gridWidth, listMode } =
    useDashboardContext();

  const router = useRouter();

  const { setRef, scrollTop } = useScrollInfo();

  const expanded = scrollTop < 100;

  const onCardClick = (data: ERC721CardData) => {
    toggleSelection(data);
  };

  const componentForId = (path: string) => {
    if (tokenFetcher) {
      switch (path) {
        case 'orders':
          return (
            <OrderbookProvider limit={50}>
              <OrderbookGraph />
            </OrderbookProvider>
          );
        case 'analytics':
          return <CenteredContent>analytics go here</CenteredContent>;
        case 'activity':
          return <CenteredContent>activity go here</CenteredContent>;
        case 'select':
          return <CenteredContent>Select a Collection</CenteredContent>;
        case 'items':
          return (
            <TokensGrid
              listMode={listMode}
              tokenFetcher={tokenFetcher}
              className="px-8 py-6"
              onClick={onCardClick}
              wrapWidth={gridWidth}
              isSelectable={isSelectable}
              isSelected={(data) => {
                return isSelected(data);
              }}
              onLoad={(value) => setNumTokens(value)}
            />
          );
      }
    }

    return <CenteredContent>Select a Collection</CenteredContent>;
  };

  const currentId = () => {
    if (tokenFetcher) {
      const tabItems = RouteUtils.tabItems(router);
      const result = tabItems.find((cmp) => {
        return cmp.path === router.asPath;
      });

      if (result) {
        return result.id;
      }
    } else {
      return 'select';
    }

    return 'error';
  };

  return (
    // This is added just for the ASortButton, so remove if we change how this works
    <OrderbookProvider limit={50}>
      <div className="flex flex-col h-full w-full">
        <GridHeader expanded={expanded} />
        <div ref={setRef} className="overflow-y-auto">
          {componentForId(currentId())}
        </div>
      </div>
    </OrderbookProvider>
  );
};
