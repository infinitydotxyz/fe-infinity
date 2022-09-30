import { BaseCollection } from '@infinityxyz/lib-frontend/types/core/Collection';
import React, { useState, useMemo, useEffect } from 'react';
import { apiGet, useFetch } from 'src/utils';
import { Button, EZImage, Spacer } from '../common';
import { FullScreenModal } from '../common/full-screen-modal';
import { PagedData } from '../gallery/token-fetcher';
import { Erc721Token } from '@infinityxyz/lib-frontend/types/core';
import { Filter } from 'src/utils/context/FilterContext';
import { API, Direction, TinderCard } from './tinder-card';

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
        {open && (
          <div className=" w-full flex flex-col items-center">
            <div className=" text-2xl font-bold mb-10">{collection?.metadata.name}</div>

            <TinderSwiper data={data.reverse()} />
          </div>
        )}
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
  const [liked, setLiked] = useState<Erc721Token[]>([]);

  console.log('rebuilding swiper?');
  console.log('liked.length');
  console.log(liked.length);

  const childRefs = useMemo(
    () =>
      Array(data.length)
        .fill(0)
        .map(() => React.createRef<HTMLDivElement>()),
    [data]
  );

  const currentIndexValid = currentIndex >= 0 && currentIndex < data.length;
  const canSwipe = currentIndexValid;
  const canGoBack = currentIndex < data.length - 1;

  const updateIndex = (index: number) => {
    if (index >= 0 && index < data.length) {
      setCurrentIndex(index);
    }
  };

  // set last direction and decrease current index
  const onSwipe = (direction: Direction, name: string, index: number) => {
    console.log(`${direction} ${name} (${index}) onSwipe`, index);

    if (direction === 'right') {
      setLiked([...liked, data[index]]);
    }

    console.log(currentIndex);

    updateIndex(currentIndex - 1);
  };

  const outOfFrame = (direction: Direction, name: string, index: number) => {
    if (direction === 'down') {
      console.log(`${direction} ${name} (${index}) outOfFrame`, index);
    }
  };

  const swipe = (dir: Direction) => {
    if (canSwipe) {
      const api = childRefs[currentIndex].current as API | null;
      if (api) {
        api.swipe(dir);
      }
    }
  };

  const goBack = () => {
    if (!canGoBack) {
      return;
    }

    const newIndex = currentIndex + 1;
    updateIndex(newIndex);

    const api = childRefs[newIndex].current as API | null;
    if (api) {
      api.restoreCard();
    }

    // remove if in liked list
    const removeTokenId = data[newIndex].tokenId;
    const newLiked = liked.filter((x) => {
      return x.tokenId !== removeTokenId;
    });

    setLiked(newLiked);
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

  const header = () => {
    let rightSide = <></>;

    if (currentIndexValid) {
      rightSide = (
        <>
          <Spacer />
          <div className="  "># {data[currentIndex].tokenId}</div>
        </>
      );
    }

    const displayIndex = data.length - currentIndex;

    return (
      <div className="p-2 w-full flex font-bold select-none">
        <div className="  ">
          {displayIndex} / {data.length}
        </div>

        {rightSide}
      </div>
    );
  };

  return (
    <div className="items-center overflow-clip w-full flex flex-col ">
      <div className="     ">
        {header()}
        <div className="relative h-96 w-96  ">
          {data.map((nft, index) => {
            return (
              <TinderCard
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ref={childRefs[index] as any}
                className="absolute top-0 left-0 right-0 bottom-0"
                key={nft.metadata.name ?? '' + index}
                onSwipe={(dir) => onSwipe(dir, nft.tokenId.toString(), index)}
                onCardLeftScreen={(dir) => outOfFrame(dir, nft.tokenId.toString(), index)}
              >
                <EZImage cover={false} src={nft.metadata.image} className=" cursor-grab rounded-3xl overflow-clip  " />
              </TinderCard>
            );
          })}
        </div>
      </div>
      {buttons}

      <TinderSwiperLikes data={liked} />
    </div>
  );
};

// ================================================================================

interface Props2 {
  data: Erc721Token[];
}

export const TinderSwiperLikes = ({ data }: Props2) => {
  return (
    <div className="items-center  flex-wrap  flex  w-full  ">
      {data.map((nft) => {
        return (
          <EZImage
            key={`${nft.collectionAddress}:${nft.tokenId}`}
            cover={false}
            src={nft.metadata.image}
            className="h-8 w-8 cursor-grab rounded-3xl overflow-clip  "
          />
        );
      })}
    </div>
  );
};
