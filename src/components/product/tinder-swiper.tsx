import { BaseCollection } from '@infinityxyz/lib-frontend/types/core/Collection';
import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  const [currentIndex, setCurrentIndex] = useState(data.length - 1);
  // used for outOfFrame closure
  const currentIndexRef = useRef<number>(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(data.length)
        .fill(0)
        .map(() => React.createRef<HTMLDivElement>()),
    []
  );

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < data.length - 1;
  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = (direction: Direction, nameToDelete: string, index: number) => {
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name: string, idx: number) => {
    // console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    // handle the case in which go back is pressed before card goes outOfFrame
    const api = currentIndexRef.current >= idx && (childRefs[idx].current as API | null);
    if (api) {
      api.restoreCard();
    }
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  };

  const swipe = (dir: Direction) => {
    if (canSwipe && currentIndex < data.length) {
      const api = childRefs[currentIndex].current as API | null;
      if (api) {
        api.swipe(dir);
      }
    }
  };

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) {
      return;
    }

    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);

    const api = currentIndexRef.current >= newIndex && (childRefs[newIndex].current as API | null);
    if (api) {
      await api.restoreCard();
    }
  };

  return (
    <div className=" items-center flex flex-col">
      <div className="relative h-80 w-80  ">
        {data.map((nft, index) => {
          //   console.log(JSON.stringify(nft, null, 2));

          return (
            <TinderCard
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ref={childRefs[index] as any}
              className="absolute top-0 left-0 right-0 bottom-0"
              key={nft.metadata.name ?? '' + index}
              onSwipe={(dir) => swiped(dir, nft.tokenId.toString(), index)}
              onCardLeftScreen={() => outOfFrame(nft.tokenId.toString(), index)}
            >
              <EZImage src={nft.metadata.image} className="  rounded-lg overflow-clip  " />
            </TinderCard>
          );
        })}
      </div>

      <div className="p-5 transition flex gap-2">
        <Button disabled={!canSwipe} onClick={() => swipe('left')}>
          Swipe left!
        </Button>
        <Button onClick={() => goBack()}>Undo swipe!</Button>
        <Button disabled={!canSwipe} onClick={() => swipe('right')}>
          Swipe right!
        </Button>
      </div>
    </div>
  );
};
