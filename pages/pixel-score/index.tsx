import { BaseCollection, CardData } from '@infinityxyz/lib/types/core';
import { useEffect, useRef, useState } from 'react';
import { CollectionList } from 'src/components/astra/collection-list';
import { TokensGrid } from 'src/components/astra/token-grid';
import { BGImage, Button, DebouncedTextField, NextLink, Spacer, SVG } from 'src/components/common';
import { apiGet } from 'src/utils';
import { iconButtonStyle, largeIconButtonStyle } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { XIcon } from '@heroicons/react/outline';

export const PixelScore = () => {
  const [collection, setCollection] = useState<BaseCollection>();
  const [selectedTokens, setSelectedTokens] = useState<CardData[]>([]);
  const [chainId, setChainId] = useState<string>();
  const [showCart, setShowCart] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const onCardClick = (data: CardData) => {
    setSelectedTokens([...selectedTokens, data]);
    setShowCart(true);
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
          <div className={twMerge(showCart ? '' : 'hidden', 'p-7')}>
            <AstraCart
              tokens={selectedTokens}
              onRemove={(value) => {
                for (const token of selectedTokens) {
                  if (token.id === value.id) {
                    // sdf
                  }
                }
              }}
            />
          </div>
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
        className="px-4 mb-3"
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

// ========================================================================================

interface Props4 {
  tokens: CardData[];
  onRemove: (token: CardData) => void;
}

const AstraCart = ({ tokens, onRemove }: Props4) => {
  return (
    <div className="flex flex-col space-y-2 items-start w-48">
      {tokens.map((token, i) => {
        return (
          <div className="flex items-center w-full">
            <div className="w-4 mr-2 text-right">{i + 1}.</div>
            <BGImage className={twMerge(largeIconButtonStyle, 'rounded-lg')} url={token.image} />
            <div className="ml-2">{token.tokenId}</div>

            <Spacer />
            <Button
              size="plain"
              variant="round"
              onClick={() => {
                onRemove(token);
              }}
            >
              <XIcon className={iconButtonStyle} />
            </Button>
          </div>
        );
      })}
    </div>
  );
};
