import { ReactNode } from 'react';
import { ERC721CardData } from '@infinityxyz/lib-frontend/types/core';
import { twMerge } from 'tailwind-merge';
import { AiOutlineEye } from 'react-icons/ai';
import { Dropdown, DropdownItems } from './dropdown';
import { Button } from './button';
import { NextLink } from './next-link';
import ContentLoader from 'react-content-loader';
import { inputBorderColor } from 'src/utils/ui-constants';
import { BGImage } from './bg-image';
import { SVG } from './svg';
import { useRouter } from 'next/router';
import { BLANK_IMG } from 'src/utils';

type labelFn = (data?: ERC721CardData) => ReactNode;

type CardAction = {
  label: string | ReactNode | labelFn;
  onClick: (ev: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, data?: ERC721CardData) => void;
};

export interface CardProps {
  data?: ERC721CardData;
  cardActions?: CardAction[];
  dropdownActions?: DropdownItems[];
  isLoading?: boolean;
  className?: string;
  height?: number;
}

export const Card = ({
  data,
  height = 290,
  cardActions,
  dropdownActions,
  isLoading,
  className = ''
}: CardProps): JSX.Element => {
  const router = useRouter();
  const title = (data?.title ?? '').length > 25 ? data?.title?.slice(0, 25) + '...' : data?.title;
  const tokenId = (data?.tokenId ?? '').length > 25 ? data?.tokenId?.slice(0, 20) + '...' : data?.tokenId;

  const buttonJsx = (
    <>
      {(cardActions ?? []).map((cardAction, idx) => {
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
    </>
  );

  if (isLoading) {
    return <LoadingCard className={className} />;
  }

  const heightStyle = `${height}px`;

  return (
    <div
      className={`
        sm:mx-0 w-full relative flex flex-col pointer-events-auto p-2 rounded-3xl
        shadow-[0_10px_10px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_10px_4px_rgba(0,0,0,0.2)]
        transition-all duration-300 group ${className}`}
      style={{ height: heightStyle }} // boxShadow: '0px 0px 16px 4px rgba(0, 0, 0, 0.07)'
    >
      <NextLink
        href={`/asset/${data?.chainId}/${data?.tokenAddress ?? data?.address}/${data?.tokenId}`}
        className="h-full overflow-clip rounded-3xl"
      >
        {data?.image ? (
          <BGImage src={data?.image} className="group-hover:scale-[1.15] transition-all duration-300" />
        ) : (
          <BGImage src={BLANK_IMG} className="" />
        )}
      </NextLink>

      {data?.rarityRank && (
        <span className="absolute bg-gray-100 top-3 right-3 py-1 px-3 rounded-full">
          {Math.round(data?.rarityRank)}
        </span>
      )}

      <div className="p-1 mt-3">
        <div
          className="flex items-center cursor-pointer font-bold truncate"
          title={data?.title}
          onClick={() => {
            router.push(`/collection/${data?.collectionSlug}`);
          }}
        >
          {title}
          {data?.hasBlueCheck ? <SVG.blueCheck className="w-5 h-5 ml-1" /> : null}
        </div>
        <div className="text-secondary font-heading" title={data?.tokenId}>
          {tokenId}
        </div>
      </div>

      <footer className="text-sm flex items-center justify-between mt-3">
        {buttonJsx}

        {(dropdownActions ?? []).length > 0 ? (
          <Dropdown
            className="ml-2"
            toggler={
              <div className={twMerge(inputBorderColor, 'border rounded-full w-10 h-10 flex flex-col justify-center')}>
                <AiOutlineEye className="w-full text-lg" />
              </div>
            }
            items={dropdownActions ?? []}
          />
        ) : null}
      </footer>
    </div>
  );
};

const LoadingCard = ({ className }: { className?: string }) => (
  <ContentLoader
    speed={2}
    width={310}
    height={350}
    viewBox="0 0 400 460"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    className={className}
  >
    <rect x="5" y="394" rx="18" ry="18" width="390" height="28" />
    <rect x="6" y="7" rx="45" ry="45" width="390" height="372" />
    <rect x="5" y="431" rx="18" ry="18" width="390" height="28" />
  </ContentLoader>
);
