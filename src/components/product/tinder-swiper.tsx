import { BaseCollection } from '@infinityxyz/lib-frontend/types/core/Collection';
import React, { useState, useMemo, useEffect } from 'react';
import { apiGet, useFetch } from 'src/utils';
import { Button, CenteredContent, EZImage, Spacer } from '../common';
import { FullScreenModal } from '../common/full-screen-modal';
import { PagedData } from '../gallery/token-fetcher';
import { Erc721Token } from '@infinityxyz/lib-frontend/types/core';
import { Filter } from 'src/utils/context/FilterContext';
import { API, Direction, TinderCard } from './tinder-card';
import mitt from 'mitt';
import { MdFavoriteBorder, MdOutlineArrowBack, MdRefresh } from 'react-icons/md';
import { inputBorderColor, largeIconButtonStyle } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

export const TinderSwiperModal = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Erc721Token[]>([]);
  const [liked, setLiked] = useState<Erc721Token[]>([]);

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
  useEffect(() => {
    setLiked([]);
  }, [open]);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Swiper</Button>
      <FullScreenModal isOpen={open} onClose={() => setOpen(false)}>
        {open && (
          <div className="w-full flex flex-col items-center  ">
            <div className=" w-full flex flex-col items-center">
              <div className=" text-2xl font-bold mb-8 select-none">{collection?.metadata.name}</div>

              <TinderSwiper data={data.reverse()} liked={liked} setLiked={setLiked} />
            </div>

            <TinderSwiperLikes data={liked} />
          </div>
        )}
      </FullScreenModal>
    </>
  );
};

// ================================================================================

interface Props {
  data: Erc721Token[];
  liked: Erc721Token[];
  setLiked: (liked: Erc721Token[]) => void;
}

export const TinderSwiper = ({ data, liked, setLiked }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(data.length - 1);
  const [emitter] = useState<TinderSwiperEmitter>(new TinderSwiperEmitter());

  const indexValid = (index: number) => {
    return index >= 0 && index < data.length;
  };

  const currentIndexValid = indexValid(currentIndex);
  const canSwipe = currentIndexValid;
  const canGoBack = currentIndex < data.length - 1;

  // handles swipe event
  useEffect(() => {
    const cb = (event: SwiperEvent) => {
      // console.log(`${event.dir} (${event.index}) onSwipe`);

      if (indexValid(event.index)) {
        if (event.dir === 'right') {
          setLiked([...liked, data[event.index]]);
        }

        updateIndex(currentIndex - 1);
      }
    };

    emitter.onSwipe(cb);

    return () => {
      emitter.removeSwipe(cb);
    };
  }, [liked, currentIndex, canSwipe]);

  const childRefs = useMemo(
    () =>
      Array(data.length)
        .fill(0)
        .map(() => React.createRef<HTMLDivElement>()),
    [data]
  );

  const updateIndex = (index: number) => {
    if (indexValid(index)) {
      setCurrentIndex(index);
    } else {
      setCurrentIndex(-1);
    }
  };

  // const onCardLeftScreen = (direction: Direction, name: string, index: number) => {
  //   console.log(`${direction} ${name} (${index}) onCardLeftScreen`, index);
  // };

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
    <div className="mt-5 flex justify-center space-x-6">
      <Button disabled={!canSwipe} variant="roundBorder" size="round" onClick={() => swipe('left')}>
        <MdOutlineArrowBack className={largeIconButtonStyle} />
      </Button>
      <Button disabled={!canGoBack} variant="roundBorder" size="round" onClick={() => goBack()}>
        <MdRefresh className={largeIconButtonStyle} />
      </Button>
      <Button disabled={!canSwipe} variant="roundBorder" size="round" onClick={() => swipe('right')}>
        <MdFavoriteBorder className={largeIconButtonStyle} />
      </Button>
    </div>
  );

  const header = () => {
    let leftSide = <div>No more NFTs</div>;
    let rightSide = <></>;

    if (currentIndexValid) {
      const displayIndex = data.length - currentIndex;

      rightSide = (
        <>
          <Spacer />
          <div className=""># {data[currentIndex].tokenId}</div>
        </>
      );

      leftSide = (
        <div className="">
          {displayIndex} / {data.length}
        </div>
      );
    }

    return (
      <div className="pb-2 px-2  w-96  flex font-bold select-none">
        {leftSide}

        {rightSide}
      </div>
    );
  };

  const cards = (
    <div className="relative h-96 w-96  ">
      <div className="border w-full h-full rounded-3xl overflow-clip">
        <CenteredContent>End of list</CenteredContent>
      </div>
      {data.map((nft, index) => {
        return (
          <TinderCard
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ref={childRefs[index] as any}
            className="absolute top-0 left-0 right-0 bottom-0"
            key={nft.metadata.name ?? '' + index}
            emitter={emitter}
            index={index}
          >
            <EZImage cover={false} src={nft.metadata.image} className=" cursor-grab rounded-3xl overflow-clip  " />
          </TinderCard>
        );
      })}
    </div>
  );

  return (
    <div className="items-center overflow-clip w-full flex flex-col ">
      <div className={twMerge(inputBorderColor, 'bg-gray-100 flex flex-col border rounded-3xl py-6 px-8 ')}>
        {header()}
        {cards}
        {buttons}
      </div>
    </div>
  );
};

// ================================================================================

interface Props2 {
  data: Erc721Token[];
}

export const TinderSwiperLikes = ({ data }: Props2) => {
  return (
    <div className="mt-6 font-bold text-black text-opacity-80  text-lg items-center justify-center   flex flex-col w-full  ">
      <div>{data.length} Liked NFTs</div>
      <div className="mt-4 max-w-3xl items-center justify-center flex-wrap gap-2 flex  w-full  ">
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
    </div>
  );
};

// ================================================================================

export type SwiperEvent = {
  dir: Direction;
  index: number;
};

type SwiperType = {
  swipe: SwiperEvent;
};

export class TinderSwiperEmitter {
  private emitter = mitt<SwiperType>();

  emitSwipe(event: SwiperEvent) {
    this.emitter.emit('swipe', event);
  }

  onSwipe(listener: (data: SwiperEvent) => void): void {
    this.emitter.on('swipe', listener);
  }

  removeSwipe(listener: (data: SwiperEvent) => void): void {
    this.emitter.off('swipe', listener);
  }
}
