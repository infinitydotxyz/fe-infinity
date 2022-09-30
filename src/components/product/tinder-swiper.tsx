import { BaseCollection } from '@infinityxyz/lib-frontend/types/core/Collection';
import React, { useState, useMemo, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import { apiGet, useFetch } from 'src/utils';
import { Button, EZImage } from '../common';
import { FullScreenModal } from '../common/full-screen-modal';
import { PagedData } from '../gallery/token-fetcher';
import { Erc721Token } from '@infinityxyz/lib-frontend/types/core';
import { Filter } from 'src/utils/context/FilterContext';

type Direction = 'left' | 'right' | 'up' | 'down';

export interface API {
  swipe(dir?: Direction): Promise<void>;
  restoreCard(): Promise<void>;
}

export const TinderSwiperModal = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Erc721Token[]>([]);

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

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Swiper</Button>
      <FullScreenModal isOpen={open} onClose={() => setOpen(false)}>
        <div className=" w-full">
          <TinderSwiper data={data} />
        </div>
      </FullScreenModal>
    </>
  );
};

// ================================================================================

interface Props {
  data: Erc721Token[];
}

export const TinderSwiper = ({ data }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const childRefs = useMemo(
    () =>
      Array(data.length)
        .fill(0)
        .map(() => React.createRef<HTMLDivElement>()),
    []
  );

  const canGoBack = currentIndex < data.length - 1;
  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = (direction: Direction, name: string, index: number) => {
    console.log(`${direction} ${name} (${index}) swiped`, index);
    setCurrentIndex(index + 1);
  };

  const outOfFrame = (direction: Direction, name: string, index: number) => {
    console.log(`${direction} ${name} (${index}) outOfFrame`, index);
  };

  const swipe = (dir: Direction) => {
    if (canSwipe && currentIndex < data.length) {
      const api = childRefs[currentIndex].current as API | null;
      if (api) {
        api.swipe(dir);
      }
    }
  };

  const goBack = async () => {
    if (!canGoBack) {
      return;
    }

    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);

    const api = childRefs[newIndex].current as API | null;
    if (api) {
      await api.restoreCard();
    }
  };

  const buttons = (
    <div className="p-5 flex gap-2">
      <Button disabled={!canSwipe} onClick={() => swipe('left')}>
        Swipe left
      </Button>
      <Button onClick={() => goBack()}>Undo</Button>
      <Button disabled={!canSwipe} onClick={() => swipe('right')}>
        Swipe right
      </Button>
    </div>
  );

  const header = (
    <div className="p-2 w-full   ">
      <div className="  ">
        {currentIndex + 1} / {data.length}
      </div>
    </div>
  );

  return (
    <div className="items-center overflow-clip  flex flex-col ">
      <div className="     ">
        {header}
        <div className="relative h-96 w-96  ">
          {data.reverse().map((nft, idx) => {
            const index = data.length - 1 - idx;

            return (
              <TinderCard
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ref={childRefs[index] as any}
                className="absolute top-0 left-0 right-0 bottom-0"
                key={nft.metadata.name ?? '' + index}
                onSwipe={(dir) => swiped(dir, nft.tokenId.toString(), index)}
                onCardLeftScreen={(dir) => outOfFrame(dir, nft.tokenId.toString(), index)}
              >
                <EZImage cover={false} src={nft.metadata.image} className=" cursor-grab rounded-3xl overflow-clip  " />
              </TinderCard>
            );
          })}
        </div>
      </div>
      {buttons}
    </div>
  );
};
