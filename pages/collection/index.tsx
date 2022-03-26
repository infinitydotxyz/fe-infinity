import { BaseCollection, CardData } from '@infinityxyz/lib/types/core';
import { getSearchFriendlyString } from '@infinityxyz/lib/utils';
import React from 'react';
import { FaEdit, FaFacebook, FaTwitter } from 'react-icons/fa';
import { PageBox } from 'src/components/common';
import { Card } from 'src/components/common/card';
import Chip from 'src/components/common/chip';
import { useFetch } from 'src/utils/apiUtil';
import { getSearchParam } from 'src/utils/commonUtil';

export function CollectionPage() {
  const collectionName = getSearchParam('name') ?? '';

  const path = `/collections/${getSearchFriendlyString(collectionName)}`;
  const { result: collection, isLoading, isError, error } = useFetch<BaseCollection>(path, { chainId: '1' });
  console.log('result, isLoading, isError, error', collection, isLoading, isError, error);

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
    <PageBox title={collectionName} className="justify-start">
      <div className="text-gray-400">{collection?.metadata.description ?? ''}</div>

      <div className="flex flex-row space-x-4">
        <Chip content="Watch" />
        <Chip left={<FaEdit />} content="Edit" />
        <Chip content={<FaTwitter />} />
        <Chip content={<FaFacebook />} />
      </div>

      <div className="flex space-x-8 mt-6">
        {data.map((item) => {
          return <Card key={item.id} data={item} />;
        })}
      </div>
    </PageBox>
  );
}

export default CollectionPage;
