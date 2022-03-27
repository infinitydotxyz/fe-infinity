import { BaseCollection, CardData } from '@infinityxyz/lib/types/core';
import { getSearchFriendlyString } from '@infinityxyz/lib/utils';
import React, { useState } from 'react';
import { FaCheck, FaEdit, FaFacebook, FaTwitter } from 'react-icons/fa';
import { Button, PageBox } from 'src/components/common';
import { Card } from 'src/components/common/card';
import Chip from 'src/components/common/chip';
import RoundedNav from 'src/components/common/rounded-nav';
import { useFetch } from 'src/utils/apiUtil';
import { getSearchParam } from 'src/utils/commonUtil';

export function CollectionPage() {
  const [currentTab, setCurrentTab] = useState(0);

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
      <div className="flex flex-row space-x-4">
        <Chip content="Watch" />
        <Chip left={<FaEdit />} content="Edit" />
        <Chip content={<FaTwitter />} />
        <Chip content={<FaFacebook />} />
      </div>

      <div className="text-gray-400 mt-6">{collection?.metadata.description ?? ''}</div>

      <div className="text-sm font-bold mt-6">
        <div>Ownership includes</div>
        <div className="flex space-x-8 mt-2">
          <div className="flex text-gray-500">
            <FaCheck className="mr-2" />
            Access
          </div>
          <div className="flex text-gray-500">
            <FaCheck className="mr-2" />
            Royalties
          </div>
          <div className="flex text-gray-500">
            <FaCheck className="mr-2" />
            IP rights
          </div>
        </div>
      </div>

      <Button variant="outline" className="mt-6">
        Claim Collection
      </Button>

      <table className="mt-8 text-sm w-1/2">
        <tr className="text-gray-400">
          <th className="text-left">Items</th>
          <th className="text-left">Owned by</th>
          <th className="text-left">Floor price</th>
          <th className="text-left">Volume traded</th>
        </tr>
        <tr className="font-bold">
          <td>379</td>
          <td>999</td>
          <td>0.40 ETH</td>
          <td>899</td>
        </tr>
      </table>

      <RoundedNav
        items={[{ title: 'NFT' }, { title: 'Community' }]}
        onChange={(currentIndex) => setCurrentTab(currentIndex)}
        className="w-80 mt-6"
      />

      <div className="mt-6">{currentTab === 0 ? <>Tab 1</> : <>Tab 2</>}</div>

      <div className="flex space-x-8 mt-6">
        {data.map((item) => {
          return <Card key={item.id} data={item} />;
        })}
      </div>
    </PageBox>
  );
}

export default CollectionPage;
