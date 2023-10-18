import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CollectionPageTabs, ellipsisString } from 'src/utils';
import { BasicTokenInfo, ERC721TokenCartItem } from 'src/utils/types';
import { iconButtonStyle, secondaryBgColor, selectionBorder } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { ARoundOutlineButton } from '../astra/astra-button';
import { TokenCardModal } from '../astra/token-grid/token-card-modal';
import { EZImage, EthSymbol } from '../common';
import { useAppContext } from 'src/utils/context/AppContext';
import { CheckedIcon, SearchIcon } from 'src/icons';

interface Props {
  data: ERC721TokenCartItem;
  selected: boolean;
  isSelectable: (data: ERC721TokenCartItem) => boolean;
  onClick: (data: ERC721TokenCartItem) => void;
  collectionFloorPrice?: string | number | null | undefined;
  collectionCreator?: string;
}

export const GridCard = ({
  data,
  onClick,
  selected,
  isSelectable,
  collectionFloorPrice,
  collectionCreator
}: Props): JSX.Element => {
  const [notSelectable, setNotSelectable] = useState(false);
  const title = data?.title;
  const tokenId = data?.tokenId;
  // const hasBlueCheck = data?.hasBlueCheck ?? false;
  const { selectedCollectionTab } = useAppContext();
  const price = data?.price ?? 0;
  const hideIcon = selectedCollectionTab === CollectionPageTabs.Bid.toString();
  const basicTokenInfo: BasicTokenInfo = {
    tokenId: data?.tokenId ?? '',
    collectionAddress: data?.address ?? '',
    collectionSlug: data?.collectionSlug ?? '',
    chainId: data?.chainId ?? '',
    collectionFloorPrice,
    lastSalePriceEth: data?.lastSalePriceEth,
    mintPriceEth: data?.mintPriceEth,
    orderPriceEth: data?.price,
    validFrom: data?.validFrom,
    validUntil: data?.validUntil,
    orderSide: data?.orderSide,
    collectionCreator
  };
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    const isModalOpen =
      router.query?.tokenId === basicTokenInfo.tokenId &&
      router.query?.collectionAddress === basicTokenInfo.collectionAddress;
    setModalOpen(isModalOpen);
  }, [router.query]);

  return (
    <div
      className={twMerge(
        secondaryBgColor,
        'rounded-lg w-full relative flex flex-col shadow-[0px_4px_10px_0px_rgba(0,0,0,0.12)] \
             hover:shadow-[0px_4px_10px_0px_rgba(0,0,0,0.2)] cursor-pointer group/nft transition-all duration-300 transform ease-in-out  bg-zinc-300 hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-900 p-2.5',
        selected ? selectionBorder : ``,
        notSelectable ? 'animate-wiggle' : ''
      )}
      style={{ aspectRatio: '3.5/5' }}
      onClick={() => {
        if (!isSelectable(data)) {
          setNotSelectable(true);
        } else {
          onClick(data);
        }
      }}
    >
      <div className="h-full flex flex-col text-2xl lg:text-sm">
        <div className="group/nft-card-image relative flex-1">
          {/* we can't overflow clip the whole card or the tooltips get clipped
              so we do this absolute image below the pillbadges */}
          {selected && (
            <div className="hidden rounded-5  group-hover/nft-card-image:flex cursor-pointer bg-black bg-opacity-30 absolute h-full text-white w-full  items-center justify-center z-10">
              <SearchIcon />
            </div>
          )}
          <div className="absolute top-0 bottom-0 left-0 right-0 rounded-5 overflow-clip">
            <EZImage src={data?.image} className="group-hover/nft:scale-110 transition-all" />
            {selected && (
              <div className={twMerge('absolute top-2 right-2  rounded-5 bg-gray-900')}>
                <CheckedIcon className={twMerge(iconButtonStyle, 'text-white')} />
              </div>
            )}
          </div>
          <div
            className={twMerge(
              'group-hover/nft:flex absolute w-full  -bottom-3.5 h-3.5 z-10 items-center justify-center',
              selected ? 'flex' : 'hidden'
            )}
          >
            <div className="w-11 rounded-10 h-0.75 bg-light-divider dark:bg-dark-disabledFade"></div>
          </div>
        </div>
        <div>
          <div className={twMerge('group-hover/nft:mt-6.25', selected ? 'mt-6.25' : 'mt-3.75')}>
            <p className="text-gray-800 text-sm not-italic font-medium leading-4.25 truncate">{title}</p>
            <div
              className={'text-neutral-700 dark:text-white text-lg not-italic font-semibold leading-5'}
              onClick={(e) => {
                e.stopPropagation();
                const { pathname, query } = router;
                query['tokenId'] = basicTokenInfo.tokenId;
                query['collectionAddress'] = basicTokenInfo.collectionAddress;
                router.replace({ pathname, query }, undefined, { shallow: true });
              }}
            >
              {ellipsisString(tokenId)}
            </div>
          </div>
          <div className="mt-3.75">
            <div
              className={
                'px-2.75 py-2.5 rounded-11 border border-light-borderLight group-hover/nft:border-transparent dark:border-dark-borderDark dark:bg-transparent bg-zinc-300'
              }
            >
              <div className="flex items-center w-full justify-between">
                <div className="flex flex-col items-start">
                  <p className="text-gray-800 text-sm not-italic font-medium leading-4.25">Price</p>
                  <p className="text-neutral-700 dark:text-white text-right text-17 not-italic font-normal  leading-5">
                    <span className="font-supply">{price}</span>
                    <span className="text-sm ml-0.75">{EthSymbol}</span>
                  </p>
                </div>
                {data?.source?.icon && !hideIcon && (
                  <div className={twMerge('flex items-center')}>
                    <EZImage src={data?.source?.icon} className="w-6 h-6 rounded-full" />
                  </div>
                )}
              </div>

              <ARoundOutlineButton
                className={twMerge(
                  'rounded-md mt-2.5 p-2.5 !leading-2.5 w-full text-xs sm:text-sm ',
                  selected
                    ? 'block'
                    : 'hidden group-hover/nft:block group-hover/nft:animate-in group-hover/nft:slide-in-from-bottom bg-neutral-700 dark:bg-white dark:text-neutral-200 text-zinc-300'
                )}
              >
                {selected ? 'Remove from Cart' : 'Add to Cart'}
              </ARoundOutlineButton>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && <TokenCardModal data={basicTokenInfo} modalOpen={modalOpen} isNFTSelected={selected} />}
    </div>
  );
};
