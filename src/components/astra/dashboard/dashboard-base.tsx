import { CenteredContent } from 'src/components/common';
import { ERC721CardData } from '@infinityxyz/lib-frontend/types/core';
import { TokensGrid } from 'src/components/astra/token-grid/token-grid';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { GridHeader, RouteUtils } from './grid-header';
import { useRouter } from 'next/router';
import { useScrollInfo } from './useScrollHook';
import { useState } from 'react';

export const DashboardBase = () => {
  const { setNumTokens, tokenFetcher, isSelected, isSelectable, toggleSelection, gridWidth } = useDashboardContext();
  const [listMode, setListMode] = useState(false);

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
          return <CenteredContent>Orders go here</CenteredContent>;
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
        return cmp.path === RouteUtils.currentPath(router);
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
    <div className="flex flex-col h-full w-full">
      <GridHeader expanded={expanded} listMode={listMode} setListMode={setListMode} />
      <div ref={setRef} className="overflow-y-auto">
        {componentForId(currentId())}
      </div>
    </div>
  );
};
