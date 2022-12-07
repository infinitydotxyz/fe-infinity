import { CenteredContent } from 'src/components/common';
import { ERC721CardData } from '@infinityxyz/lib-frontend/types/core';
import { TokensGrid } from 'src/components/astra/token-grid/token-grid';
import { useDashboardContext } from 'src/utils/context/DashboardContext';

export const DashboardBase = () => {
  const { setNumTokens, tokenFetcher, isSelected, isSelectable, toggleSelection, gridWidth } = useDashboardContext();

  const onCardClick = (data: ERC721CardData) => {
    toggleSelection(data);
  };

  let tokensGrid;

  const emptyMessage = 'Select a Collection';

  if (tokenFetcher) {
    tokensGrid = (
      <div className="flex flex-col h-full w-full">
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
      </div>
    );
  } else {
    tokensGrid = <CenteredContent>{emptyMessage}</CenteredContent>;
  }

  return tokensGrid;
};
