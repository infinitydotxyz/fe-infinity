import { CenterFixed } from 'src/components/common';
import { ERC721CardData } from '@infinityxyz/lib-frontend/types/core';
import { TokensGrid } from 'src/components/astra/token-grid/token-grid';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { GridHeader, RouteUtils } from './grid-header';
import { useRouter } from 'next/router';
import { useScrollInfo } from './useScrollHook';

export const DashboardBase = () => {
  const { setNumTokens, tokenFetcher, isSelected, isSelectable, toggleSelection, gridWidth } = useDashboardContext();

  const router = useRouter();

  const { setRef, scrollTop } = useScrollInfo();

  const expanded = scrollTop < 100;

  const onCardClick = (data: ERC721CardData) => {
    toggleSelection(data);
  };

  const findSlugMatchingCmp = () => {
    if (tokenFetcher) {
      const routes = [
        {
          slug: '/new/items',
          label: 'Items',
          component: (
            <TokensGrid
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
          )
        },
        {
          slug: '/new/orders',
          label: 'Orders',
          component: <CenterFixed>Orders go here</CenterFixed>
        }
      ];

      const result = routes.find((cmp) => {
        return cmp.slug === RouteUtils.currentPath(router);
      });

      if (result) {
        return result;
      }
    } else {
      return {
        slug: 'select',
        label: 'Select',
        component: <CenterFixed>Select a Collection</CenterFixed>
      };
    }

    return {
      slug: 'error',
      label: 'Error',
      component: <CenterFixed>An Error occurred</CenterFixed>
    };
  };

  return (
    <div className="flex flex-col h-full w-full">
      <GridHeader expanded={expanded} />
      <div ref={setRef} className="overflow-y-auto">
        {findSlugMatchingCmp().component}
      </div>
    </div>
  );
};
