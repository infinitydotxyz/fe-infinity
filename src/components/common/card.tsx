import { ERC721CardData } from '@infinityxyz/lib-frontend/types/core';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { Button } from './button';
import { Dropdown, DropdownItems } from './dropdown';
import { NextLink } from './next-link';
import { trimLowerCase } from '@infinityxyz/lib-frontend/utils';
import { useRouter } from 'next/router';
import { MdMoreVert } from 'react-icons/md';
import { ellipsisAddress, ENS_ADDRESS } from 'src/utils';
import { inputBorderColor } from 'src/utils/ui-constants';
import { SVG } from './svg';
import { EZImage } from './ez-image';

type labelFn = (data?: ERC721CardData) => ReactNode;

export type CardAction = {
  label: string | ReactNode | labelFn;
  onClick: (ev: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, data?: ERC721CardData) => void;
};

export interface CardProps {
  data?: ERC721CardData;
  cardActions?: CardAction[];
  getDropdownActions?: (data: ERC721CardData | undefined) => DropdownItems[] | null;
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

  const buttonJsx = (
    <div className="flex w-[100%]">
      {(cardActions ?? []).map((cardAction, idx) => {
        if (!cardAction?.label) {
          return null;
        }
        return (
          <Button
            key={idx}
            variant="primary"
            className="flex-1 py-2.5 text-lg"
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

  if (isLoading) {
    return <></>;
    // return <LoadingCard className={className} />;
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
        className="h-full overflow-clip rounded-3xl"
      >
        <EZImage src={data?.image} className="group-hover:scale-[1.15] transition-all duration-300" />
      </NextLink>

      {data?.rarityRank && (
        <span className="absolute bg-gray-100 top-5 right-5 py-1 px-3 rounded-full">
          {Math.round(data?.rarityRank)}
        </span>
      )}

      <div className="p-1 mt-3">
        <div
          className="flex items-center cursor-pointer font-bold truncate"
          title={data?.title}
          onClick={() => {
            router.push(`/collection/${data?.collectionSlug || `${data?.chainId}:${data?.address}`}`);
          }}
        >
          <div>{collectionName ? collectionName : <>&nbsp;</>}</div>
          {data?.hasBlueCheck ? <SVG.blueCheck className="w-5 h-5 ml-1 shrink-0" /> : null}
        </div>
        <div className="text-secondary font-heading" title={data?.tokenId}>
          {tokenId}
        </div>
      </div>

      <footer className="text-sm flex items-center justify-between mt-3">
        {buttonJsx}

        {getDropdownActions && getDropdownActions(data) !== null ? (
          <Dropdown
            className="ml-2"
            toggler={
              <div className={twMerge(inputBorderColor, 'border rounded-full w-12 h-12 flex flex-col justify-center')}>
                <MdMoreVert className="w-full text-lg" />
              </div>
            }
            items={getDropdownActions(data) ?? []}
          />
        ) : null}
      </footer>
    </div>
  );
};

// const LoadingCard = ({ className }: { className?: string }) => (
//   <ContentLoader
//     speed={2}
//     width={310}
//     height={350}
//     viewBox="0 0 400 460"
//     backgroundColor="#f3f3f3"
//     foregroundColor="#ecebeb"
//     className={className}
//   >
//     <rect x="5" y="394" rx="18" ry="18" width="390" height="28" />
//     <rect x="6" y="7" rx="45" ry="45" width="390" height="372" />
//     <rect x="5" y="431" rx="18" ry="18" width="390" height="28" />
//   </ContentLoader>
// );
