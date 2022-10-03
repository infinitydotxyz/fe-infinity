import React, { useState } from 'react';
import { Button, EZImage, HelpTip, Modal } from '../common';
import { Erc721Token } from '@infinityxyz/lib-frontend/types/core';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { largeIconButtonStyle } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { SwiperEmitter } from './swiper-emitter';

interface Props {
  data: Erc721Token[];
  liked: boolean;
  emitter: SwiperEmitter;
}

export const SwiperLikes = ({ data, liked, emitter }: Props) => {
  return (
    <div className="mt-6 font-bold text-black text-opacity-80  text-lg items-center justify-center   flex flex-col w-full  ">
      <div>
        {data.length} {liked ? 'Liked NFTs' : 'Skipped NFTs'}
      </div>
      <div className="mt-4 max-w-3xl items-center justify-center flex-wrap gap-2 flex  w-full  ">
        {data.map((nft) => {
          return (
            <SwiperLikeCard key={`${nft.collectionAddress}:${nft.tokenId}`} nft={nft} emitter={emitter} liked={liked} />
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
interface Props2 {
  nft: Erc721Token;
  emitter: SwiperEmitter;
  liked: boolean;
}

export const SwiperLikeCard = ({ nft, emitter, liked }: Props2) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <HelpTip
        content={
          <div className="flex flex-col items-center">
            <div>Token id</div>
            <div># {nft.tokenId}</div>
          </div>
        }
      >
        <EZImage
          cover={false}
          src={nft.metadata.image}
          className="h-8 w-8 cursor-grab rounded-3xl overflow-clip  "
          onClick={() => setOpen(true)}
        />
      </HelpTip>

      <SwiperLikeModal open={open} setOpen={setOpen} nft={nft} emitter={emitter} isLiked={liked} />
    </>
  );
};

// =========================================================================
interface Props3 {
  nft: Erc721Token;
  open: boolean;
  setOpen: (open: boolean) => void;
  emitter: SwiperEmitter;
  isLiked: boolean;
}

export const SwiperLikeModal = ({ nft, open, setOpen, emitter, isLiked }: Props3) => {
  return (
    <Modal
      isOpen={open}
      wide={false}
      onClose={() => setOpen(false)}
      cancelButton=""
      okButton=""
      showCloseIcon={true}
      title={`Token id: ${nft.tokenId}`}
    >
      {open && (
        <div className="flex flex-col items-center ">
          <EZImage
            cover={false}
            src={nft.metadata.image}
            className="h-96 w-96 cursor-grab rounded-3xl overflow-clip mb-6 "
          />

          <Button
            variant="roundBorder"
            size="round"
            onClick={() => {
              emitter.emitSwipeLike({ liked: !isLiked, tokenId: nft.tokenId, nft: nft });
            }}
          >
            {isLiked && <MdFavorite className={twMerge(largeIconButtonStyle, 'text-red-700')} />}

            {!isLiked && <MdFavoriteBorder className={twMerge(largeIconButtonStyle, 'text-red-700')} />}
          </Button>
        </div>
      )}
    </Modal>
  );
};
