import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BlueCheck, Checkbox, EZImage, ScrollLoader, Spacer } from 'src/components/common';
import { GridCard } from 'src/components/common/card';
import { BasicTokenInfo, ERC721TokenCartItem } from 'src/utils/types';
import { hoverColor, textColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { AOutlineButton } from '../astra-button';
import { ErrorOrLoading } from '../error-or-loading';
import { TokenCardModal } from './token-card-modal';
interface Props {
  listMode: boolean;
  className?: string;
  onClick?: (data: ERC721TokenCartItem) => void;
  isSelected: (data: ERC721TokenCartItem) => boolean;
  isSelectable: (data: ERC721TokenCartItem) => boolean;
  data: ERC721TokenCartItem[];
  hasNextPage: boolean;
  onFetchMore?: () => void;
  isError?: boolean;
  isLoading?: boolean;
  collectionFloorPrice?: string | number | null | undefined;
  collectionCreator?: string;
}

export const TokenGrid = ({
  className = '',
  onClick,
  isSelected,
  isSelectable,
  listMode,
  data: cardData,
  hasNextPage,
  onFetchMore,
  isError,
  isLoading,
  collectionFloorPrice,
  collectionCreator
}: Props) => {
  let contents;

  if (isError) {
    contents = <ErrorOrLoading error={!!isError || !!isLoading} noData={cardData.length === 0} />;
  } else {
    if (listMode) {
      contents = (
        <>
          <div className={twMerge('md:pb-20 pb-5 space-y-1 flex flex-col')}>
            {cardData.map((data) => {
              return (
                <GridItem
                  key={data.id}
                  data={data}
                  selected={isSelected(data)}
                  isSelectable={isSelectable}
                  collectionFloorPrice={collectionFloorPrice}
                  onClick={(data) => {
                    onClick?.(data);
                  }}
                />
              );
            })}
          </div>

          {hasNextPage && onFetchMore && <ScrollLoader onFetchMore={onFetchMore} />}
        </>
      );
    } else {
      contents = (
        <>
          <div
            className="md:pb-20 pb-5 grid grid-flow-row-dense gap-5 3xl:grid-cols-[repeat(auto-fill,_minmax(258px,_1fr))]
                          sm:grid-cols-[repeat(auto-fill,_minmax(225px,_1fr))] grid-cols-[repeat(auto-fit,_minmax(169px,_1fr))]"
          >
            {cardData.map((data) => {
              return (
                <GridCard
                  key={data.id}
                  data={data}
                  selected={isSelected(data)}
                  collectionFloorPrice={collectionFloorPrice}
                  collectionCreator={collectionCreator}
                  isSelectable={isSelectable}
                  onClick={(data) => {
                    onClick?.(data);
                  }}
                />
              );
            })}
          </div>

          {hasNextPage && onFetchMore && <ScrollLoader onFetchMore={onFetchMore} />}
        </>
      );
    }
  }

  return <div className={twMerge('h-full w-full mb-3', className)}>{contents}</div>;
};

interface Props2 {
  data: ERC721TokenCartItem;
  selected: boolean;
  isSelectable: (data: ERC721TokenCartItem) => boolean;
  onClick: (data: ERC721TokenCartItem) => void;
  collectionFloorPrice?: string | number | null | undefined;
}

const GridItem = ({ data, onClick, selected, isSelectable, collectionFloorPrice }: Props2): JSX.Element => {
  const [notSelectable, setNotSelectable] = useState(false);
  const title = data?.title;
  const tokenId = data?.tokenId;
  const hasBlueCheck = data?.hasBlueCheck ?? false;
  const basicTokenInfo: BasicTokenInfo = {
    tokenId: data?.tokenId ?? '',
    collectionAddress: data?.address ?? '',
    collectionSlug: data?.collectionSlug ?? '',
    chainId: data?.chainId ?? '',
    collectionFloorPrice
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
        hoverColor,
        'w-full relative flex flex-col  px-3 py-2 transition-all duration-200',
        notSelectable ? 'animate-wiggle' : ''
      )}
      onClick={() => {
        if (!isSelectable(data)) {
          setNotSelectable(true);
        } else {
          onClick(data);
        }
      }}
      onAnimationEnd={() => setNotSelectable(false)}
    >
      <div className="h-full flex items-center  text-2xl lg:text-sm">
        <Checkbox
          label=""
          checked={selected}
          onChange={() => {
            // setChecked(isChecked);
          }}
        />

        <EZImage src={data?.image} className=" w-12 h-12 mr-4 rounded-lg overflow-clip" />

        <div className={textColor}>
          <div className="flex items-center">
            <div className=" text-sm truncate flex-1 mr-2">{title}</div>
            {hasBlueCheck ? <BlueCheck className={'h-5 w-5'} /> : ''}
          </div>

          <div className="truncate text-lg font-bold">{tokenId}</div>
        </div>

        <Spacer />
        <AOutlineButton
          small
          onClick={() => {
            const { pathname, query } = router;
            query['tokenId'] = basicTokenInfo.tokenId;
            query['collectionAddress'] = basicTokenInfo.collectionAddress;
            router.replace({ pathname, query }, undefined, { shallow: true });
          }}
        >
          Details
        </AOutlineButton>
      </div>

      {modalOpen && <TokenCardModal data={basicTokenInfo} modalOpen={modalOpen} />}
    </div>
  );
};
