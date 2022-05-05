import { BaseCollection, CardData } from '@infinityxyz/lib/types/core';
import { useEffect, useRef, useState } from 'react';
import { CollectionList } from 'src/components/astra/collection-list';
import { TokensGrid } from 'src/components/astra/token-grid';
import { Button, DebouncedTextField, NextLink, Spacer, SVG } from 'src/components/common';
import { apiGet } from 'src/utils';
import { largeIconButtonStyle } from 'src/utils/ui-constants';

export const PixelScore = () => {
  const [collection, setCollection] = useState<BaseCollection>();
  const [chainId, setChainId] = useState<string>();
  const ref = useRef<HTMLDivElement>(null);

  const onCardClick = (data: CardData) => {
    console.log(data);
  };

  let tokensGrid;

  if (collection && chainId) {
    tokensGrid = <TokensGrid collection={collection} chainId={chainId} onClick={onCardClick} />;
  }

  useEffect(() => {
    ref.current?.scrollTo({ left: 0, top: 0 });
  }, [collection]);

  return (
    <div>
      <div className="h-screen w-screen grid grid-rows-[auto_1fr] grid-cols-[300px_1fr_auto]">
        <div className="col-span-3 border-b bg-slate-200">
          <AstraHeader />
        </div>

        <div className="row-span-2 col-span-1 border-r bg-slate-100">
          <Sidebar
            onClick={(value) => {
              setCollection(value);
              setChainId(value.chainId);
            }}
          />
        </div>

        {tokensGrid && (
          <div ref={ref} className="row-span-2 col-span-1 overflow-y-auto p-7">
            {tokensGrid}
          </div>
        )}

        <div className="row-span-2 col-span-1 overflow-y-auto">
          <div className="hidden p-7">harry</div>
        </div>
      </div>
    </div>
  );
};

export default PixelScore;

// ========================================================================================

const AstraHeader = () => {
  return (
    <div className="flex px-4 py-3 items-center">
      <NextLink href="/" className="flex items-center">
        <SVG.miniLogo className={largeIconButtonStyle} />
        <div className="ml-4 text-2xl font-bold">Astra</div>
      </NextLink>
      <Spacer />
      <Button>Connect</Button>
    </div>
  );
};

// ========================================================================================

interface Props {
  onClick: (value: BaseCollection) => void;
}
const Sidebar = ({ onClick }: Props) => {
  const [query, setQuery] = useState('');

  const collectionsList = (
    <CollectionList
      query={query}
      onClick={async (collection) => {
        const { result } = await apiGet(`/collections/${collection.chainId}:${collection.address}`);
        const colt = result as BaseCollection;

        onClick(colt);
      }}
    />
  );

  return (
    <div className="flex flex-col pt-3 h-full items-center">
      <DebouncedTextField
        className="px-4 mb-2"
        value={query}
        placeholder="Search"
        onChange={(value) => {
          setQuery(value);
        }}
      />
      <div className="overflow-y-auto overflow-x-hidden w-full px-4">{collectionsList}</div>
    </div>
  );
};
