import { ERC721CardData } from '@infinityxyz/lib-frontend/types/core';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { Button } from '../common/button';
import { NextLink } from '../common/next-link';
import { trimLowerCase } from '@infinityxyz/lib-frontend/utils';
import { useRouter } from 'next/router';
import { MdMoreVert } from 'react-icons/md';
import { displayTypeToProps, ellipsisAddress, ENS_ADDRESS } from 'src/utils';
import { EZImage } from '../common/ez-image';
import { BlueCheck } from '../common/blue-check';
import { ADropdown, ADropdownItem } from '../astra/astra-dropdown';

type labelFn = (data?: ERC721CardData) => ReactNode;

export type CardAction = {
  label: string | ReactNode | labelFn;
  onClick: (ev: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, data?: ERC721CardData) => void;
};

export interface CardProps {
  data?: ERC721CardData;
  cardActions?: CardAction[];
  getDropdownActions?: (data: ERC721CardData | undefined) => ADropdownItem[] | null;
  isLoading?: boolean;
  className?: string;
  height?: number;
}

export const Card = ({
  data,
  height = 290,
  cardActions,
  getDropdownActions,
  isLoading,
  className = ''
}: CardProps): JSX.Element => {
  const router = useRouter();
  let collectionName = data?.title || data?.collectionName || ellipsisAddress(data?.address) || 'Collection';
  collectionName = collectionName.length > 25 ? collectionName.slice(0, 25) + '...' : collectionName;

  let tokenId = data?.tokenId ?? '';
  // special case for ENS
  const collectionAddress = trimLowerCase(data?.address ?? data?.tokenAddress);
  if (collectionAddress === ENS_ADDRESS && data?.name && !trimLowerCase(data.name).includes('unknown ens name')) {
    tokenId = data.name;
  }

  tokenId = tokenId.length > 15 ? tokenId.slice(0, 10) + '...' : tokenId;

  const buttonJsx = () => {
    return (
      <div className="flex w-full">
        {(cardActions ?? []).map((cardAction, idx) => {
          if (!cardAction?.label) {
            return null;
          }
          return (
            <Button
              key={idx}
              variant="primary"
              size="large"
              className="flex-1"
              onClick={(ev) => {
                cardAction.onClick(ev, data);
              }}
            >
              {typeof cardAction.label === 'function' ? cardAction.label(data) : cardAction.label}
            </Button>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return <></>;
    // return <LoadingCard className={className} />;
  }

  const { isCover, padding } = displayTypeToProps(data?.displayType);
  let image = (
    <EZImage
      src={data?.image}
      className={twMerge('group-hover:scale-[1.15] transition-all duration-300', padding)}
      cover={isCover}
    />
  );

  if (data?.isVideo) {
    image = <video loop controls src={data?.image}></video>;
  }

  const heightStyle = `${height}px`;
  return (
    <div
      className={`
        sm:mx-0 w-full relative flex flex-col pointer-events-auto p-2 rounded-3xl
        shadow-[0_20px_20px_1px_rgba(0,0,0,0.1),0_-4px_20px_1px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_20px_1px_rgba(0,0,0,0.15),0_-4px_20px_1px_rgba(0,0,0,0.05)]
        transition-all duration-300 group ${className}`}
      style={{ height: heightStyle }} // boxShadow: '0px 0px 16px 4px rgba(0, 0, 0, 0.07)'
    >
      <NextLink
        href={`/asset/${data?.chainId}/${data?.tokenAddress ?? data?.address}/${data?.tokenId}`}
        className="h-full overflow-clip rounded-t-3xl"
      >
        {image}
      </NextLink>

      {/* {data?.rarityRank && (
        <span className="absolute bg-theme-light-200 top-5 right-5 py-1 px-3 rounded-full">
          {Math.round(data?.rarityRank)}
        </span>
      )} */}

      <div className="p-1 mt-2">
        <div
          className="flex items-center cursor-pointer font-bold truncate"
          title={data?.title}
          onClick={() => {
            router.push(`/collection/${data?.collectionSlug || `${data?.chainId}:${data?.address}`}`);
          }}
        >
          <div>{collectionName ? collectionName : <>&nbsp;</>}</div>
          {data?.hasBlueCheck ? <BlueCheck className="ml-1" /> : null}
        </div>
        <div className=" font-heading" title={data?.tokenId}>
          {tokenId}
        </div>
      </div>

      <footer className="text-sm flex items-center justify-between mt-3">
        {buttonJsx()}

        {getDropdownActions && getDropdownActions(data) !== null ? (
          <ADropdown
            className="ml-2"
            label={<MdMoreVert className="w-full text-lg" />}
            items={getDropdownActions(data) ?? []}
          />
        ) : null}
      </footer>
    </div>
  );
};
