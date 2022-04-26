import React, { useEffect, useState } from 'react';
import { Button, ToggleTab, useToggleTab, Spacer, Dropdown, PageBox, CollectionGrid } from 'src/components/common';
import { OrderDrawer } from 'src/components/market';
import { BaseCollection } from '@infinityxyz/lib/types/core';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { FaShoppingBag } from 'react-icons/fa';
import { RiLayoutGridFill } from 'react-icons/ri';
import { OrderbookList } from 'src/components/market/orderbook-list';
import { GalleryBox } from 'src/components/gallery/gallery-box';
import { CollectionCache } from 'src/components/market/orderbook-list/collection-cache';

export default function MarketPage() {
  const { orderDrawerOpen, setOrderDrawerOpen, isOrderStateEmpty, addCartItem } = useOrderContext();
  const { options, onChange, selected } = useToggleTab(['Assets', 'Orderbook'], 'Assets');

  const [collection, setCollection] = useState<BaseCollection | undefined>();

  const updateCollections = async () => {
    const col = await CollectionCache.oneCollection('f');

    setCollection(col);
  };

  useEffect(() => {
    updateCollections();
  }, []);

  const contents = (
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
          <CollectionGrid
            query="fan"
            className="my-4"
            onClick={(collection) => {
              addCartItem({
                collectionName: collection.name ?? '(no name)',
                collectionAddress: collection.address ?? '(no address)',
                collectionImage: collection.profileImage ?? '',
                isSellOrder: false
              });
            }}
          />

          <CollectionGrid
            query="fan"
            className="my-4"
            onClick={(collection) => {
              addCartItem({
                collectionName: collection.name ?? '(no name)',
                collectionAddress: collection.address ?? '(no address)',
                collectionImage: collection.profileImage ?? '',
                isSellOrder: false
              });
            }}
          />

          {collection && (
            <GalleryBox
              collection={collection}
              cardProps={{
                cardActions: [
                  {
                    label: 'Add',
                    onClick: (ev, data) => {
                      addCartItem({
                        collectionName: data?.collectionName ?? '(no name)',
                        collectionAddress: data?.tokenAddress ?? '(no address)',
                        tokenImage: data?.image ?? '',
                        tokenName: data?.title ?? '(no name)',
                        tokenId: data?.tokenId ?? '0',
                        isSellOrder: false
                      });
                    }
                  }
                ]
              }}
            />
          )}
        </>
      )}

      {selected === 'Orderbook' && <OrderbookList />}
    </>
  );

  return (
    <PageBox
      title="Market"
      rightToolbar={
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

      <div>{contents}</div>
    </PageBox>
  );
}
