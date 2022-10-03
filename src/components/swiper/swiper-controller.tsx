import { BaseCollection } from '@infinityxyz/lib-frontend/types/core/Collection';
import React, { useState, useEffect } from 'react';
import { apiGet, useFetch } from 'src/utils';
import { PagedData } from '../gallery/token-fetcher';
import { Erc721Token } from '@infinityxyz/lib-frontend/types/core';
import { Filter } from 'src/utils/context/FilterContext';
import { TinderSwiperLikes } from './swiper-likes';
import { TinderSwiper } from './tinder-swiper';

export const SwiperController = () => {
  const [data, setData] = useState<Erc721Token[]>([]);
  const [liked, setLiked] = useState<Erc721Token[]>([]);
  const [skipped, setSkipped] = useState<Erc721Token[]>([]);

  const path = `/collections/boredapeyachtclub`;
  const { result: collection } = useFetch<BaseCollection>(path, { chainId: '1' });

  const fetch = async () => {
    if (collection) {
      const filter: Filter = { chainId: '1', orderBy: 'tokenIdNumeric', orderDirection: 'asc' };

      const response = await apiGet(`/collections/${collection.chainId}:${collection.address}/nfts`, {
        query: {
          chainId: '1',
          limit: 50,
          cursor: '',
          ...filter
        }
      });

      if (response.error) {
        console.log(response.error);
      } else {
        if (response.result) {
          const result = response.result as PagedData;

          setData(result.data);
        }
      }
    }
  };

  useEffect(() => {
    fetch();
  }, [collection]);

  // clear this out on open since it would have the previous likes
  // useEffect(() => {
  //   setLiked([]);
  //   setSkipped([]);
  // }, [open]);

  return (
    <div className="w-full flex flex-col items-center  ">
      <div className=" w-full flex flex-col items-center">
        <div className=" text-2xl font-bold mb-8 select-none">{collection?.metadata.name}</div>

        <TinderSwiper
          data={data.reverse()}
          liked={liked}
          setLiked={setLiked}
          skipped={skipped}
          setSkipped={setSkipped}
        />
      </div>

      <TinderSwiperLikes data={liked} liked={true} />
      <TinderSwiperLikes data={skipped} liked={false} />
    </div>
  );
};
