import { BaseCollection, CardData } from '@infinityxyz/lib/types/core';
import { useEffect, useRef, useState } from 'react';
import { TokensGrid } from 'src/components/astra/token-grid';
import { CenteredContent, Toaster, toastSuccess } from 'src/components/common';
import { twMerge } from 'tailwind-merge';
import { AstraNavbar } from 'src/components/astra/astra-navbar';
import { AstraSidebar } from 'src/components/astra/astra-sidebar';
import { AstraCart } from 'src/components/astra/astra-cart';

export const PixelScore = () => {
  const [collection, setCollection] = useState<BaseCollection>();
  const [selectedTokens, setSelectedTokens] = useState<CardData[]>([]);
  const [chainId, setChainId] = useState<string>();
  const [showCart, setShowCart] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const onCardClick = (data: CardData) => {
    const i = indexOfSelection(data);

    if (i === -1) {
      setSelectedTokens([...selectedTokens, data]);
      setShowCart(true);
    } else {
      removeFromSelection(data);
    }
  };

  let tokensGrid;

  if (collection && chainId) {
    tokensGrid = (
      <TokensGrid
        collection={collection}
        chainId={chainId}
        onClick={onCardClick}
        isSelected={(data) => {
          const i = indexOfSelection(data);

          return i !== -1;
        }}
      />
    );
  } else {
    tokensGrid = <CenteredContent>Select a Collection</CenteredContent>;
  }

  useEffect(() => {
    ref.current?.scrollTo({ left: 0, top: 0 });
  }, [collection]);

  const indexOfSelection = (value: CardData) => {
    const i = selectedTokens.findIndex((token) => {
      return value.id === token.id;
    });

    return i;
  };

  const removeFromSelection = (value: CardData) => {
    const i = indexOfSelection(value);

    if (i !== -1) {
      const copy = [...selectedTokens];
      copy.splice(i, 1);

      setSelectedTokens(copy);

      if (copy.length === 0) {
        setShowCart(false);
      }
    }
  };

  const handleCheckout = () => {
    setSelectedTokens([]);
    setShowCart(false);

    toastSuccess('Success', 'Something happened');
  };

  return (
    <div>
      <div className="h-screen w-screen grid grid-rows-[auto_1fr] grid-cols-[300px_1fr_auto]">
        <div className="col-span-3 border-b bg-slate-200">
          <AstraNavbar />
        </div>

        <div className="row-span-2 col-span-1 border-r bg-slate-100">
          <AstraSidebar
            selectedCollection={collection}
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
          <div className={twMerge(showCart ? '' : 'hidden', 'p-7 h-full')}>
            <AstraCart
              tokens={selectedTokens}
              onCheckout={handleCheckout}
              onRemove={(value) => {
                removeFromSelection(value);
              }}
            />
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default PixelScore;
