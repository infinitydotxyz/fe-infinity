import React from 'react';
import { BGImage } from 'src/components/common';
import { BLANK_IMAGE_URL } from 'src/utils';
import { trimText } from 'src/components/common/read-more-text';
import { CollectionSearchDto } from '../../utils/types/collection-types';
import { twMerge } from 'tailwind-merge';

interface Props2 {
  collection: CollectionSearchDto;
  selected: boolean;
  onClick: (collection: CollectionSearchDto) => void;
}

const getAvatarUrl = (imgUrl: string) => {
  if (!imgUrl) {
    return null;
  } else {
    const index = imgUrl.indexOf('=');
    if (index) {
      return imgUrl.slice(0, index) + '=h100';
    }
    return imgUrl;
  }
};

export const CollectionListItem = ({ collection, onClick, selected }: Props2) => {
  const shortText = trimText(collection.description, 70, 70, 70)[0];
  const isTrimText = shortText.length !== collection.description.length;

  const avatarUrl = getAvatarUrl(collection.bannerImage) || BLANK_IMAGE_URL;

  return (
    <div
      className={twMerge(
        'w-full cursor-pointer border border-gray-400 bg-white   rounded-t-3xl overflow-clip h-24 relative',
        selected ? 'outline-4 outline-slate-400 outline-offset-1 outline' : ''
      )}
      onClick={() => onClick(collection)}
    >
      <BGImage url={avatarUrl} />

      <div className="text-theme-light-800 tracking-tight absolute bottom-0 left-0 right-0">
        <div className="bg-white mx-3 rounded-t-lg bg-opacity-90 overflow-clip  pt-1 pb-2 ">
          <div className="text-center text-sm font-bold text-black">{collection.name}</div>

          <div className=" break-all  leading-3 text-xs px-5 text-theme-light-800">
            {shortText}
            {isTrimText && '...'}
          </div>
        </div>
      </div>
    </div>
  );
};
