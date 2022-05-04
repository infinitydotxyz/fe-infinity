import { BaseCollection, CardData } from '@infinityxyz/lib/types/core';
import { useState } from 'react';
import { Button, CollectionGrid, PageBox, TokensGrid } from 'src/components/common';
import { OrderDrawer } from 'src/components/market/order-drawer/order-drawer';
import { apiGet } from 'src/utils';
import { useOrderContext } from 'src/utils/context/OrderContext';

export const PixelScore = () => {
  const { orderDrawerOpen, setOrderDrawerOpen } = useOrderContext();
  const [collection, setCollection] = useState<BaseCollection>();
  const [chainId, setChainId] = useState<string>();

  const onButtonClick = (ev: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, data: CardData) => {
    console.log(ev);
    console.log(data);
  };

  let contents;

  if (collection && chainId) {
    contents = (
      <>
        <Button
          onClick={() => {
            setCollection(undefined);
            setChainId(undefined);
          }}
        >
          Back
        </Button>
        <TokensGrid collection={collection} chainId={chainId} buttonName="Pixel Score" onButtonClick={onButtonClick} />
      </>
    );
  } else {
    contents = (
      <CollectionGrid
        query=""
        buttonName="Tokens"
        onButtonClick={async (collection) => {
          // why is there a collectionSearchDto and BaseCollection???
          const { result } = await apiGet(`/collections/${collection.chainId}:${collection.address}`);
          const colt = result as BaseCollection;

          setCollection(colt);
          setChainId(collection.chainId);

          // addCartItem({
          //   collectionName: collection.name ?? '(no name)',
          //   collectionAddress: collection.address ?? '(no address)',
          //   collectionImage: collection.profileImage ?? '',
          //   isSellOrder: false
          // });
        }}
      />
    );
  }

  return (
    <PageBox title="Pixel Score">
      {contents}
      <OrderDrawer open={orderDrawerOpen} onClose={() => setOrderDrawerOpen(false)} />
    </PageBox>
  );
};

export default PixelScore;
