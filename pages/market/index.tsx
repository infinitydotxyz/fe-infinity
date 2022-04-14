import React, { useState } from 'react';
import { Button, Card, ToggleTab, useToggleTab, PageBox, Spacer, Dropdown } from 'src/components/common';
import { OrderDrawer, OrderDebug } from 'src/components/market';
import { CardData } from '@infinityxyz/lib/types/core';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { FaShoppingBag } from 'react-icons/fa';
import { RiLayoutGridFill } from 'react-icons/ri';
import { OrderbookList } from 'src/components/market/orderbook-list';

// get image ids here https://picsum.photos/images
const testCardData: CardData[] = [
  {
    id: 'nft1',
    title: 'NFT 1',
    collectionName: 'Bearded Apes',
    tokenId: '0x2343ddd2434234',
    tokenAddress: '0xlaksdjdlasdjf234234lkj',
    price: 1.5,
    image: 'https://picsum.photos/id/1004/200',

    name: 'string',
    description: 'string',
    cardImage: 'string',
    imagePreview: 'string',
    inStock: 11,
    maker: 'string',
    owner: 'string',
    chainId: '1',
    expirationTime: '12/12/23',
    hasBlueCheck: false
    //  metadata?: Metadata;
    // order: Order,
  },
  {
    id: 'nft2',
    title: 'NFT 2',
    collectionName: 'Wholely Wrappers',
    tokenAddress: '0xlakdsfsjdlddasdjf234234lkj',
    tokenId: '0x34234dd2342423423dd42342',
    price: 2.5,
    image: 'https://picsum.photos/id/1005/200',

    name: 'string',
    description: 'string',
    cardImage: 'string',
    imagePreview: 'string',
    inStock: 11,
    maker: 'string',
    owner: 'string',
    chainId: '1',
    expirationTime: '12/12/23',
    hasBlueCheck: false
    //  metadata?: Metadata;
    // order: Order,
  },
  {
    id: 'nft3',
    title: 'Not bad',
    collectionName: 'Meth and Love',
    tokenAddress: '0xlakdsfddsjdlasdjf234234lkj',
    tokenId: '0x342342dd34242ff342342342',
    price: 2.5,
    image: 'https://picsum.photos/id/1027/200',

    name: 'string',
    description: 'string',
    cardImage: 'string',
    imagePreview: 'string',
    inStock: 11,
    maker: 'string',
    owner: 'string',
    chainId: '1',
    expirationTime: '12/12/23',
    hasBlueCheck: false
    //  metadata?: Metadata;
    // order: Order,
  },
  {
    id: 'nft4',
    title: 'NFT Poop',
    collectionName: 'Meth and Love',
    tokenAddress: '0xlakdsddfsjdlasdjf234234lkj',
    tokenId: '0x34234234242342342ff342',
    price: 2.5,
    image: 'https://picsum.photos/id/1033/200',

    name: 'string',
    description: 'string',
    cardImage: 'string',
    imagePreview: 'string',
    inStock: 11,
    maker: 'string',
    owner: 'string',
    chainId: '1',
    expirationTime: '12/12/23',
    hasBlueCheck: false
    //  metadata?: Metadata;
    // order: Order,
  }
];

export default function MarketPage() {
  const [showDebugTools, setShowDebugTools] = useState(false);
  const { orderDrawerOpen, setOrderDrawerOpen, isOrderStateEmpty, addCartItem } = useOrderContext();
  const { options, onChange, selected } = useToggleTab(['Assets', 'Orderbook'], 'Assets');

  let contents;
  if (showDebugTools) {
    contents = <OrderDebug />;
  } else {
    const buyCards = testCardData.map((cardData) => (
      <Card
        key={cardData.tokenId}
        data={cardData}
        onClick={() => {
          addCartItem({
            collectionName: cardData.collectionName ?? '(no name)',
            collectionAddress: cardData.tokenAddress ?? '(no address)',
            imageUrl: cardData.image ?? '',
            tokenName: cardData.title ?? '(no name)',
            tokenId: cardData.tokenAddress ?? '(no address)',
            isSellOrder: false
          });
          setOrderDrawerOpen(true);
        }}
        isSellCard={false}
      />
    ));

    const sellCards = testCardData.map((cardData) => (
      <Card
        key={cardData.tokenId}
        data={cardData}
        onClick={() => {
          addCartItem({
            collectionName: cardData.collectionName ?? '(no name)',
            collectionAddress: cardData.tokenAddress ?? '(no address)',
            imageUrl: cardData.image ?? '',
            tokenName: cardData.title ?? '(no name)',
            tokenId: cardData.tokenAddress ?? '(no address)',
            isSellOrder: true
          });
          setOrderDrawerOpen(true);
        }}
        isSellCard={true}
      />
    ));

    contents = (
      <>
        <div className="flex space-x-2 items-center mb-2">
          <ToggleTab options={options} selected={selected} onChange={onChange} />
          <Spacer />
          <Button variant="outline" className="font-heading">
            Filter
          </Button>
          <Dropdown
            label="Sort"
            items={[
              { label: 'High to low', onClick: console.log },
              { label: 'Low to high', onClick: console.log }
            ]}
          />
          <RiLayoutGridFill />
        </div>

        {selected === 'Assets' && (
          <>
            <div className="flex flex-row flex-wrap space-x-4 mb-6">{buyCards}</div>

            <div className="flex flex-row flex-wrap space-x-4 mb-6">{sellCards}</div>
          </>
        )}

        {selected === 'Orderbook' && <OrderbookList />}
      </>
    );
  }

  return (
    <PageBox
      title="Market"
      rightSide={
        <Button
          disabled={isOrderStateEmpty()}
          variant="outline"
          onClick={async () => {
            setOrderDrawerOpen(!orderDrawerOpen);
          }}
        >
          <FaShoppingBag />
        </Button>
      }
    >
      <OrderDrawer open={orderDrawerOpen} onClose={() => setOrderDrawerOpen(false)} />

      <div>
        {contents}

        <Button className="fixed bottom-1 left-1 " onClick={() => setShowDebugTools(!showDebugTools)} variant="outline">
          Debug
        </Button>
      </div>
    </PageBox>
  );
}
