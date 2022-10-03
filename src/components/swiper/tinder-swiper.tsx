import React, { useState, useMemo, useEffect } from 'react';
import { Button, CenteredContent, EZImage, Spacer } from '../common';
import { FullScreenModal } from '../common/full-screen-modal';
import { Erc721Token } from '@infinityxyz/lib-frontend/types/core';
import { API, Direction, TinderCard } from './tinder-card';
import { MdFavoriteBorder, MdOutlineArrowBack, MdRefresh } from 'react-icons/md';
import { inputBorderColor, largeIconButtonStyle } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { SwiperEvent, TinderSwiperEmitter } from './swiper-emitter';
import { SwiperController } from './swiper-controller';

export const TinderSwiperModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Swiper</Button>
      <FullScreenModal isOpen={open} onClose={() => setOpen(false)}>
        {open && <SwiperController />}
      </FullScreenModal>
    </>
  );
};

// ================================================================================

interface Props {
  data: Erc721Token[];
  liked: Erc721Token[];
  setLiked: (liked: Erc721Token[]) => void;
  skipped: Erc721Token[];
  setSkipped: (liked: Erc721Token[]) => void;
}

export const TinderSwiper = ({ data, liked, setLiked, skipped, setSkipped }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [emitter] = useState<TinderSwiperEmitter>(new TinderSwiperEmitter());

  const indexValid = (index: number) => {
    return index >= 0 && index < data.length;
  };

  const currentIndexValid = indexValid(currentIndex);
  const canSwipe = currentIndexValid;
  const canGoBack = currentIndex < data.length - 1;

  useEffect(() => {
    setCurrentIndex(data.length - 1);
  }, [data]);

  // handles swipe event
  useEffect(() => {
    const cb = (event: SwiperEvent) => {
      if (indexValid(event.index)) {
        if (event.dir === 'right') {
          setLiked([...liked, data[event.index]]);
        } else {
          setSkipped([...skipped, data[event.index]]);
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

    // remove if in skipped list
    const newSkipped = skipped.filter((x) => {
      return x.tokenId !== removeTokenId;
    });

    setLiked(newLiked);
    setSkipped(newSkipped);
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
