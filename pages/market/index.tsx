import React, { useState } from 'react';
import { Button, Card, ToggleTab, useToggleTab, PageBox } from 'src/components/common';
import { OrderDrawer } from 'src/components/market/order-drawer';
import { CardData } from '@infinityxyz/lib/types/core';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { FaShoppingBag } from 'react-icons/fa';
import { OrderDebug } from 'src/components/market/order_debug';

const testCardData: CardData[] = [
  {
    id: 'nft1',
    title: 'NFT 1',
    collectionName: 'Bearded Apes',
    tokenId: '0x23432434234',
    tokenAddress: '0xlaksjdlasdjf234234lkj',
    price: 1.5,
    image:
      'https://media.voguebusiness.com/photos/61b8dfb99ba90ab572dea0bd/3:4/w_1998,h_2664,c_limit/adidas-nft-voguebus-adidas-nft-dec-21-story.jpg'
  },
  {
    id: 'nft2',
    title: 'NFT 2',
    collectionName: 'Wholely Wrappers',
    tokenAddress: '0xlakdsfsjdlasdjf234234lkj',
    tokenId: '0x34234234242342342342',
    price: 2.5,
    image:
      'https://media.voguebusiness.com/photos/61b8dfb99ba90ab572dea0bd/3:4/w_1998,h_2664,c_limit/adidas-nft-voguebus-adidas-nft-dec-21-story.jpg'
  }
];

export default function MarketPage() {
  const [showDebugTools, setShowDebugTools] = useState(false);
  const { orderDrawerOpen, setOrderDrawerOpen, isOrderEmpty } = useOrderContext();
  const { options, onChange, selected } = useToggleTab(['Assets', 'Orderbook'], 'Assets');

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
            <div className="flex justify-between items-center mb-2">
              <ToggleTab options={options} selected={selected} onChange={onChange} />
              <Button variant="outline">Filter</Button>
            </div>

            <div className="flex flex-row space-x-4 mb-6">
              <Card data={testCardData[0]} />
              <Card data={testCardData[1]} />
            </div>
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
