import { BaseCollection, CardData } from '@infinityxyz/lib/types/core';
import { getSearchFriendlyString } from '@infinityxyz/lib/utils';
import { useFetch } from 'src/utils/apiUtil';
import { Button } from '../common';
import { Card } from '../common/card';

interface GalleryProps {
  collection: BaseCollection | null;
}

export function Gallery({ collection }: GalleryProps) {
  const path = `/collections/${getSearchFriendlyString(collection?.slug)}`;
  const { result, isLoading, isError, error } = useFetch<BaseCollection>(path, { chainId: '1' });
  console.log('result, isLoading, isError, error', result, isLoading, isError, error);

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
  if (isLoading) {
    return <>Loading...</>;
  }
  return (
    <div>
      <header className="text-right">
        <Button variant="outline">Show Filter</Button>
        <Button variant="outline" className="ml-2">
          Sort
        </Button>
      </header>

      <div className="flex">
        <div className="w-1/3">Filter Panel</div>

        <div className="flex space-x-8 mt-6">
          {data.map((item) => {
            return <Card key={item.id} data={item} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default Gallery;
