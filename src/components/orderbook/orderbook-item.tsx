import { ChainId, OBOrder, OBOrderItem } from '@infinityxyz/lib-frontend/types/core';
import { OBTokenInfoDto } from '@infinityxyz/lib-frontend/types/dto/orders';
import { trimLowerCase } from '@infinityxyz/lib-frontend/utils';

import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import { TokenCardModal } from 'src/components/astra/token-grid/token-card-modal';
import { BlueCheckInline, NextLink } from 'src/components/common';
import { ellipsisString, ENS_ADDRESS } from 'src/utils';
import { BasicTokenInfo } from 'src/utils/types';
import { secondaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { AImage } from '../astra/astra-image';

type Props1 = {
  content?: ReactNode;
  title?: string;
  order: OBOrder;
  nameItem?: boolean;
  sortClick?: () => void;
  onClick?: () => void;
  canShowAssetModal?: boolean;
};

export const OrderbookItem = ({ title, content, nameItem, order, onClick, canShowAssetModal }: Props1): JSX.Element => {
  const router = useRouter();

  if (nameItem) {
    // one collection
    if (order.nfts.length === 1) {
      const nft = order.nfts[0];

      // one item from one collection
      if (nft.tokens.length === 1) {
        const token = nft.tokens[0];
        return (
          <SingleCollectionCell
            canShowAssetModal={canShowAssetModal}
            image={token?.tokenImage || nft.collectionImage}
            title={nft.collectionName}
            orderNft={nft}
            token={token}
            onClick={onClick}
          />
        );
      } else {
        // multiple items from one collection
        return (
          <SingleCollectionCell
            canShowAssetModal={false}
            order={order}
            nfts={order.nfts}
            onClickTitle={() => {
              router.push(`/collection/${nft.collectionSlug}`);
            }}
            image={nft.collectionImage}
            title={nft.collectionName}
            count={nft.tokens.length}
            onClick={onClick}
          />
        );
      }
    }

    // multiple collections
    if (order.nfts.length > 1) {
      return <MultiCollectionCell nfts={order.nfts} onClick={onClick} />;
    }
  }

  return (
    <div className="flex flex-col min-w-0">
      <div className={twMerge(secondaryTextColor, 'font-medium')}>{title}</div>
      <div className="">{content}</div>
    </div>
  );
};

// ==================================================================

type Props2 = {
  nfts: OBOrderItem[];
  onClick?: () => void;
};

const MultiCollectionCell = ({ nfts, onClick }: Props2) => {
  return (
    <div className="flex gap-2 items-center hover:cursor-pointer" onClick={onClick}>
      <div className="flex -space-x-8 overflow-hidden">
        {nfts.map((nft: OBOrderItem) => {
          return (
            <AImage
              key={nft.collectionAddress}
              className="inline-block h-12 w-12 rounded-lg overflow-clip ring-2"
              src={nft.collectionImage}
            />
          );
        })}
      </div>

      <div className="flex flex-col truncate">
        <div className="truncate font-medium">{nfts.length} Collections</div>
      </div>
    </div>
  );
};

// ==================================================================

type Props3 = {
  order?: OBOrder;
  image: string;
  title: string;
  orderNft?: OBOrderItem;
  token?: OBTokenInfoDto;
  count?: number;
  onClickTitle?: () => void;
  nfts?: OBOrderItem[];
  onClick?: () => void;
  canShowAssetModal?: boolean;
};

const SingleCollectionCell = ({
  order,
  image,
  title,
  onClickTitle,
  orderNft,
  token,
  count = 0,
  nfts,
  canShowAssetModal
}: Props3) => {
  const tokenNames: string[] = [];
  const [modalOpen, setModalOpen] = useState(false);
  let basicTokenInfo: BasicTokenInfo | null = null;

  if (nfts && nfts.length && nfts[0].tokens) {
    for (const nft of nfts) {
      for (const token of nft.tokens) {
        tokenNames.push(`Token: ${token.tokenId}`);
      }
    }
  }

  let tokenId = token?.tokenId ?? '';
  // special case for ENS
  const collectionAddress = trimLowerCase(orderNft?.collectionAddress ?? '');
  if (collectionAddress === ENS_ADDRESS && token?.tokenName) {
    tokenId = token?.tokenName;
  }

  if (count < 1 && tokenId && orderNft) {
    basicTokenInfo = {
      tokenId: tokenId,
      collectionAddress: orderNft?.collectionAddress ?? '',
      chainId: orderNft?.chainId ?? ChainId.Mainnet
    };
  }

  const router = useRouter();

  useEffect(() => {
    if (basicTokenInfo) {
      const isModalOpen =
        router.query?.tokenId === basicTokenInfo.tokenId &&
        router.query?.collectionAddress === basicTokenInfo.collectionAddress;
      setModalOpen(isModalOpen);
    }
  }, [router.query]);

  return (
    <div className="flex gap-2 items-center">
      {canShowAssetModal && modalOpen && basicTokenInfo && (
        <TokenCardModal data={basicTokenInfo} modalOpen={modalOpen} />
      )}

      <div className="flex justify-center shrink-0 h-14 w-14 mr-2">
        <AImage
          className={twMerge('h-14 w-14 rounded-lg overflow-clip', canShowAssetModal ? 'cursor-pointer' : '')}
          src={image}
          onClick={() => {
            if (basicTokenInfo) {
              const { pathname, query } = router;
              query['tokenId'] = basicTokenInfo.tokenId;
              query['collectionAddress'] = basicTokenInfo.collectionAddress;
              router.replace({ pathname, query }, undefined, { shallow: true });
            }
          }}
        />

        {count > 1 && (
          <div className="text-xs text-center pt-1 absolute top-0 right-0 block h-6 w-6 transform -translate-y-1/2 translate-x-1/2 rounded-full">
            {count}
          </div>
        )}
      </div>

      <div className={`flex flex-col truncate ${onClickTitle ? 'cursor-pointer' : ''}`}>
        {orderNft?.collectionSlug ? (
          <NextLink
            href={`/collection/${orderNft?.collectionSlug}`}
            className="font-bold whitespace-pre-wrap flex items-center"
            title={title}
          >
            <div className={twMerge(secondaryTextColor, 'font-medium')}>
              {title}
              {orderNft?.hasBlueCheck === true && <BlueCheckInline />}
            </div>
          </NextLink>
        ) : (
          <NextLink
            href={`/collection/${order?.nfts[0]?.collectionSlug}`}
            className="font-bold whitespace-pre-wrap flex items-center"
            title={title}
          >
            <div>
              {title}
              {orderNft?.hasBlueCheck === true && <BlueCheckInline />}
            </div>
          </NextLink>
        )}

        {count > 1 ? (
          <div>
            {/* <div data-tip data-for={`counter-${order?.id}`}>
              {count} NFTs
            </div>
            <ReactTooltip id={`counter-${order?.id}`} effect="solid">
              <div className="space-y-2">
                {tokenNames.map((name, idx) => (
                  <div key={idx}>{name}</div>
                ))}
              </div>
            </ReactTooltip> */}
          </div>
        ) : (
          <>{tokenId && <div className={twMerge('whitespace-pre-wrap')}>{ellipsisString(tokenId)}</div>}</>
        )}
      </div>
    </div>
  );
};

// ==================================================================
// not used, but keeping for possible future

type Props4 = {
  nfts: OBOrderItem[];
  selection: Map<string, boolean>;
  onChange: (selection: Map<string, boolean>) => void;
  className?: string;
};

export const NFTPicker = ({ nfts, selection, onChange, className = '' }: Props4) => {
  let firstItem = '';

  return (
    <div className={twMerge('flex flex-wrap space-y-8', className)}>
      <div>Pick one: </div>
      {nfts.map((nft) => {
        return nft.tokens.map((token) => {
          const key = `${nft.collectionAddress}:${token.tokenId}`;

          if (!firstItem) {
            firstItem = key;
          }

          const checked = selection.get(key) ?? false;

          return (
            <SelectableImage
              key={key}
              name={token.tokenId}
              imageUrl={token.tokenImage}
              checked={checked}
              onChange={(checked) => {
                const sel = new Map<string, boolean>();

                if (checked) {
                  sel.set(key, true);
                } else {
                  // select first one?
                  sel.set(firstItem, true);
                }

                onChange(sel);
              }}
            />
          );
        });
      })}
    </div>
  );
};

// ====================================================================

interface Props5 {
  checked: boolean;
  imageUrl: string;
  name: string;
  onChange: (checked: boolean) => void;
}

const SelectableImage = ({ name, checked, imageUrl, onChange }: Props5) => {
  return (
    <div onClick={() => onChange(!checked)} className="flex flex-col items-center">
      <AImage
        className={twMerge(
          'h-14 w-14 rounded-lg overflow-clip border-4',
          checked ? ' border-blue-500' : 'border-transparent'
        )}
        src={imageUrl}
      />
      <div className={twMerge('mt-1 px-2', checked ? 'bg-blue-500 rounded-lg' : '')}>{name}</div>
    </div>
  );
};
