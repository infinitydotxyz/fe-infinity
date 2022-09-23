import { CuratedCollectionDto } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections.dto';
import { useRouter } from 'next/router';
import React from 'react';
// import { useUserCurationQuota } from 'src/hooks/api/useCurationQuota';
import { EZImage, SVG } from '../common';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import { twMerge } from 'tailwind-merge';

type Props = {
  curatedCollections: CuratedCollectionDto[][];
};

export const CurationCardScroller: React.FC<Props> = ({ curatedCollections: curatedCollectionsArray }) => {
  const router = useRouter();
  // const { result: quota } = useUserCurationQuota();

  const curatedCollections = curatedCollectionsArray?.flat();
  type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

  function onWheel(apiObj: scrollVisibilityApiType, ev: React.WheelEvent): void {
    const isTouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

    if (isTouchpad) {
      ev.stopPropagation();
      return;
    }

    if (ev.deltaY > 0) {
      apiObj.scrollNext();
    } else if (ev.deltaY < 0) {
      apiObj.scrollPrev();
    }
  }

  return (
    <ScrollMenu
      wrapperClassName="flex overflow-x-scroll   overflow-y-clip w-full h-full "
      scrollContainerClassName="    p-7  "
      separatorClassName="w-4 shrink-0  "
      itemClassName={twMerge(
        'w-1/3 shrink-0 aspect-h-1 aspect-w-4 relative flex items-center',
        'overflow-hidden rounded-2xl bg-gray-100 shadow-md shadow-slate-200 pointer-events-auto'
      )}
      onWheel={onWheel}
    >
      {curatedCollections.map((curatedCollection, i) => (
        <CurationCardScrollerCard
          key={i}
          collection={curatedCollection}
          index={i + 1}
          onClick={() => router.push(`/collection/${curatedCollection.slug}`)}
          // votes={quota?.availableVotes || 0}
        />
      ))}
    </ScrollMenu>
  );
};

// =================================================================

type Props2 = {
  index: number;
  collection: CuratedCollectionDto;
  onClick: () => void;
};

const CurationCardScrollerCard: React.FC<Props2> = ({ collection, onClick }) => {
  return (
    <div className="flex flex-col cursor-pointer" onClick={onClick}>
      <div className="flex-1    ">
        <EZImage src={collection.bannerImage} className="border  shrink-0 w-full h-full" />
      </div>

      <div className="flex relative  px-5 py-2 items-center">
        <div className=" p-1 bg-white  rounded-xl -mt-5   ">
          <EZImage
            src={collection.profileImage}
            className="border rounded-xl overflow-clip shrink-0 w-16 h-16  bg-gray-300"
          />
        </div>

        <div className="text-theme-light-900 font-bold text-md ml-4 flex flex-row">
          {collection.name} {collection.hasBlueCheck && <SVG.blueCheck className="h-5 w-5 ml-1.5" />}
        </div>
      </div>
    </div>
  );
};
