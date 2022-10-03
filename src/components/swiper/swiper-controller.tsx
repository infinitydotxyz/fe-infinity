import { BaseCollection } from '@infinityxyz/lib-frontend/types/core/Collection';
import React, { useState, useEffect } from 'react';
import { apiGet, useFetch } from 'src/utils';
import { PagedData } from '../gallery/token-fetcher';
import { Erc721Token } from '@infinityxyz/lib-frontend/types/core';
import { Filter } from 'src/utils/context/FilterContext';
import { SwiperLikes } from './swiper-likes';
import { NFTSwiper } from './nft-swiper';
import { SwiperEmitter, SwiperLikeEvent } from './swiper-emitter';

export const SwiperController = () => {
  const [data, setData] = useState<Erc721Token[]>([]);
  const [liked, setLiked] = useState<Erc721Token[]>([]);
  const [skipped, setSkipped] = useState<Erc721Token[]>([]);
  const [emitter] = useState<SwiperEmitter>(new SwiperEmitter());

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

  // handles like event from modal
  useEffect(() => {
    const cb = (event: SwiperLikeEvent) => {
      // remove if in liked list
      const removeTokenId = event.tokenId;
      const newLiked = liked.filter((x) => {
        return x.tokenId !== removeTokenId;
      });

      // remove if in skipped list
      const newSkipped = skipped.filter((x) => {
        return x.tokenId !== removeTokenId;
      });

      // add to list
      if (event.liked) {
        newLiked.push(event.nft);
      } else {
        newSkipped.push(event.nft);
      }

      setLiked(newLiked);
      setSkipped(newSkipped);
    };

    emitter.onSwipeLike(cb);

    return () => {
      emitter.removeSwipeLike(cb);
    };
  }, [liked, skipped]);

  return (
    <div className="w-full flex flex-col items-center  ">
      <div className=" w-full flex flex-col items-center">
        <div className=" text-2xl font-bold mb-8 select-none">{collection?.metadata.name}</div>

        <NFTSwiper
          data={data.reverse()}
          liked={liked}
          setLiked={setLiked}
          skipped={skipped}
          setSkipped={setSkipped}
          emitter={emitter}
        />
      </div>

      <SwiperLikes data={liked} liked={true} emitter={emitter} />
      <SwiperLikes data={skipped} liked={false} emitter={emitter} />
    </div>
  );
};
