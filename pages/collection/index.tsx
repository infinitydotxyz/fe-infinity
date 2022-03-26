import { CardData } from '@infinityxyz/lib/types/core';
import React, { useEffect } from 'react';
import { Card } from 'src/components/common/card';
import { getSearchParam } from 'src/utils/commonUtil';

export const CollectionPage = () => {
  useEffect(() => {
    console.log('name', getSearchParam('name'));
  }, []);

  const data: CardData[] = [
    {
      id: 'nft1',
      title: 'NFT 1',
      price: 1.5,
      image:
        'https://media.voguebusiness.com/photos/61b8dfb99ba90ab572dea0bd/3:4/w_1998,h_2664,c_limit/adidas-nft-voguebus-adidas-nft-dec-21-story.jpg'
    },
    {
      id: 'nft2',
      title: 'NFT 2',
      price: 2.5,
      image:
        'https://media.voguebusiness.com/photos/61b8dfb99ba90ab572dea0bd/3:4/w_1998,h_2664,c_limit/adidas-nft-voguebus-adidas-nft-dec-21-story.jpg'
    }
  ];
  return (
    <div>
      <h1>Collection Page</h1>

      <div className="flex space-x-4">
        {data.map((item) => {
          return <Card key={item.id} data={item} />;
        })}
      </div>
    </div>
  );
};

export default CollectionPage;
