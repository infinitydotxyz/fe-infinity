import React from 'react';
import { EZImage, HelpTip } from '../common';
import { Erc721Token } from '@infinityxyz/lib-frontend/types/core';

interface Props2 {
  data: Erc721Token[];
  liked: boolean;
}

export const TinderSwiperLikes = ({ data, liked }: Props2) => {
  return (
    <div className="mt-6 font-bold text-black text-opacity-80  text-lg items-center justify-center   flex flex-col w-full  ">
      <div>
        {data.length} {liked ? 'Liked NFTs' : 'Skipped NFTs'}
      </div>
      <div className="mt-4 max-w-3xl items-center justify-center flex-wrap gap-2 flex  w-full  ">
        {data.map((nft) => {
          return (
            <HelpTip
              content={
                <div className="flex flex-col items-center">
                  <div>Token id</div>
                  <div># {nft.tokenId}</div>
                </div>
              }
            >
              <EZImage
                key={`${nft.collectionAddress}:${nft.tokenId}`}
                cover={false}
                src={nft.metadata.image}
                className="h-8 w-8 cursor-grab rounded-3xl overflow-clip  "
              />
            </HelpTip>
          );
        })}
      </div>
    </div>
  );
};
