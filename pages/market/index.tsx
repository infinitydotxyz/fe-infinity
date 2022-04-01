import React, { useState } from 'react';
import { Button, Card, ToggleTab, useToggleTab, PageBox, Spacer, Dropdown } from 'src/components/common';
import { OrderDrawer } from 'src/components/market/order-drawer';
import { CardData } from '@infinityxyz/lib/types/core';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { FaShoppingBag } from 'react-icons/fa';
import { OrderDebug } from 'src/components/market/order_debug';
import { RiLayoutGridFill } from 'react-icons/ri';

// get image ids here https://picsum.photos/images
const testCardData: CardData[] = [
  {
    id: 'nft1',
    title: 'NFT 1',
    collectionName: 'Bearded Apes',
    tokenId: '0x2343ddd2434234',
    tokenAddress: '0xlaksdjdlasdjf234234lkj',
    price: 1.5,
    image: 'https://picsum.photos/id/1004/200'
  },
  {
    id: 'nft2',
    title: 'NFT 2',
    collectionName: 'Wholely Wrappers',
    tokenAddress: '0xlakdsfsjdlddasdjf234234lkj',
    tokenId: '0x34234dd2342423423dd42342',
    price: 2.5,
    image: 'https://picsum.photos/id/1005/200'
  },
  {
    id: 'nft3',
    title: 'Not bad',
    collectionName: 'Meth and Love',
    tokenAddress: '0xlakdsfddsjdlasdjf234234lkj',
    tokenId: '0x342342dd34242ff342342342',
    price: 2.5,
    image: 'https://picsum.photos/id/1027/200'
  },
  {
    id: 'nft4',
    title: 'NFT Poop',
    collectionName: 'Meth and Love',
    tokenAddress: '0xlakdsddfsjdlasdjf234234lkj',
    tokenId: '0x34234234242342342ff342',
    price: 2.5,
    image: 'https://picsum.photos/id/1033/200'
  }
];

export default function MarketPage() {
  const [showDebugTools, setShowDebugTools] = useState(false);
  const { orderDrawerOpen, setOrderDrawerOpen, isOrderEmpty } = useOrderContext();
  const { options, onChange, selected } = useToggleTab(['Assets', 'Orderbook'], 'Assets');

  const cards = testCardData.map((e) => <Card key={e.tokenId} data={e} />);

  return (
    <PageBox
      title="Market"
      rightSide={
        !isOrderEmpty() ? (
          <Button
            variant="outline"
            onClick={async () => {
              setOrderDrawerOpen(!orderDrawerOpen);
            }}
          >
            <FaShoppingBag />
          </Button>
        ) : undefined
      }
    >
      <OrderDrawer open={orderDrawerOpen} onClose={() => setOrderDrawerOpen(false)} />

      <div>
        {!showDebugTools && (
          <>
            <div className="flex space-x-2 items-center mb-2">
              <ToggleTab options={options} selected={selected} onChange={onChange} />
              <Spacer />
              <Button variant="outline">Filter</Button>
              <Dropdown
                label="Sort"
                items={[
                  { label: 'High to low', onClick: console.log },
                  { label: 'Low to high', onClick: console.log }
                ]}
              />
              <RiLayoutGridFill />
            </div>

            <div className="flex flex-row flex-wrap space-x-4 mb-6">{cards}</div>
          </>
        )}

        {showDebugTools && <OrderDebug />}

        <Button className="fixed bottom-1 left-1 " onClick={() => setShowDebugTools(!showDebugTools)} variant="outline">
          Debug
        </Button>
      </div>
    </PageBox>
  );
}
