import { ChainId, Collection, CollectionStats } from '@infinityxyz/lib-frontend/types/core';
import { useState } from 'react';
import { FaDiscord, FaInstagram } from 'react-icons/fa';
import { BlueCheck, ClipboardButton, EZImage, EthSymbol, ReadMoreText, Spacer } from 'src/components/common';
import etherscanLogo from 'src/images/etherscan-logo.png';
import { ellipsisAddress, getChainScannerBase } from 'src/utils';
import {
  borderColor,
  golderBorderColor,
  hoverColor,
  hoverColorNewBrandText,
  mediumIconButtonStyle,
  secondaryTextColor
} from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { SocialXIcon } from 'src/icons';

export interface CollectionPageHeaderProps {
  expanded: boolean;
  avatarUrl: string;
  title: string;
  slug: string;
  description?: string;
  hasBlueCheck?: boolean;
  children?: React.ReactNode;
  collection?: Collection & Partial<CollectionStats>;
  totalVol: string | number | null | undefined;
  floorPrice: string | number | null | undefined;
  numOwners: string | number | null | undefined;
  numNfts: string | number | null | undefined;
  twitterFollowers: string | number | null | undefined;
  discordFollowers: string | number | null | undefined;
  tabs: string[];
  onTabChange: (tab: string) => void;
}

export const CollectionPageHeader = ({
  expanded,
  avatarUrl,
  title,
  description,
  hasBlueCheck,
  collection,
  totalVol,
  floorPrice,
  numOwners,
  numNfts,
  tabs,
  onTabChange
}: CollectionPageHeaderProps) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const chainId = (collection?.chainId ?? '1') as ChainId;

  // const { result: matchingEngineStatus, isInitialLoadComplete } = useMatchingEngineCollection(
  //   collection?.address ?? '',
  //   chainId
  // );

  return (
    <div className={twMerge(borderColor, 'border-b')}>
      {expanded && (
        <div className="flex flex-col space-y-3">
          <div className="flex w-full items-center text-center md:flex-row flex-col md:pl-5">
            <div className="flex flex-col-reverse md:flex-row w-full items-center space-x-2">
              <div className="py-7.5 flex-1 flex flex-col md:flex-row items-center">
                <EZImage
                  src={avatarUrl}
                  className="md:mr-5 h-25 w-25 rounded-lg cursor-pointer hover:scale-90 duration-100"
                  onClick={() => window.open(collection?.metadata?.links?.external)}
                />
                <div>
                  <div className="flex flex-col md:flex-row items-center gap-1">
                    <h4 className="font-extrabold text-35 text-neutral-700 dark:text-white font-body">{title}</h4>
                    <div className="flex text-17 space-x-5 items-center justify-center">
                      {hasBlueCheck ? <BlueCheck /> : null}
                      <div className="flex items-start gap-1">
                        <p className="text-17 font-supply text-neutral-700 dark:text-white leading-5">
                          {ellipsisAddress(collection?.address).toLowerCase()}
                        </p>
                        <ClipboardButton
                          textToCopy={collection?.address ?? ''}
                          className={twMerge(mediumIconButtonStyle)}
                        />
                      </div>
                    </div>
                  </div>
                  {description ? (
                    <div className="px-5 md:px-0 max-w-5xl font-body font-semibold text-neutral-700 dark:text-white md:text-left text-center">
                      <ReadMoreText text={description} min={30} ideal={60} max={100} />
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="p-2.5 flex flex-row gap-2.5 md:gap-0 justify-center flex-wrap md:flex-col items-end">
                <div
                  className={twMerge(
                    hoverColor,
                    'py-2.5 px-4 cursor-pointer bg-zinc-300 dark:bg-zinc-900 md:dark:bg-transparent md:bg-transparent rounded-full'
                  )}
                  onClick={() => window.open(getChainScannerBase(chainId) + '/address/' + collection?.address)}
                >
                  <span className="flex items-center">
                    <EZImage src={etherscanLogo.src} className="mr-2.5 h-5 w-5 rounded-lg" />
                    <p className="text-sm dark:text-white font-medium text-neutral-700 font-body">Etherscan</p>
                  </span>
                </div>

                {collection?.metadata?.links?.external ? (
                  <div
                    className={twMerge(
                      hoverColor,
                      'py-2.5 px-4 cursor-pointer bg-zinc-300 dark:bg-zinc-900 md:dark:bg-transparent md:bg-transparent rounded-full'
                    )}
                    onClick={() => window.open(collection.metadata?.links?.external)}
                  >
                    <span className="flex items-center">
                      <EZImage src={avatarUrl} className="mr-2.5 h-5 w-5" />
                      <p className="text-sm dark:text-white font-medium text-neutral-700 font-body">Website</p>
                    </span>
                  </div>
                ) : null}
                {collection?.metadata?.links?.discord ? (
                  <div
                    className={twMerge(
                      hoverColor,
                      'py-2.5 px-4 cursor-pointer bg-zinc-300 dark:bg-zinc-900 md:dark:bg-transparent md:bg-transparent rounded-full'
                    )}
                    onClick={() => window.open(collection?.metadata?.links?.discord)}
                  >
                    <span className="flex items-center text-sm">
                      <div className="">
                        <FaDiscord
                          className={twMerge(
                            hoverColorNewBrandText,
                            'mr-2.5 dark:text-neutral-300 text-neutral-700 h-5 w-5'
                          )}
                        />
                      </div>
                      <p className="text-sm dark:text-white font-medium text-neutral-700 font-body">Discord</p>
                    </span>
                  </div>
                ) : null}
                {collection?.metadata?.links?.twitter ? (
                  <div
                    className={twMerge(
                      hoverColor,
                      'py-2.5 px-4 cursor-pointer bg-zinc-300 dark:bg-zinc-900 md:dark:bg-transparent md:bg-transparent rounded-full'
                    )}
                    onClick={() => window.open(collection?.metadata?.links?.twitter)}
                  >
                    <span className="flex items-center text-sm">
                      <div className="">
                        <SocialXIcon
                          className={twMerge(
                            hoverColorNewBrandText,
                            'mr-2.5 h-5 w-5.5 dark:text-neutral-300 text-neutral-700'
                          )}
                          aria-hidden="true"
                        />
                      </div>
                      <p className="text-sm dark:text-white font-medium text-neutral-700 font-body">x.com</p>
                    </span>
                  </div>
                ) : null}
                {collection?.metadata?.links?.instagram ? (
                  <div
                    className={twMerge(hoverColor, 'py-2 px-2.5 cursor-pointer flex items-center')}
                    onClick={() => window.open(collection?.metadata?.links?.instagram)}
                  >
                    <FaInstagram
                      className={twMerge(
                        hoverColorNewBrandText,
                        'mr-2.5 h-5 w-5.5 dark:text-neutral-300 text-neutral-700'
                      )}
                    />
                    <p className="text-sm dark:text-white font-medium text-neutral-700 font-body">Instagram</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* <div className="flex mt-4">
        <div className="flex text-sm items-center">
          <div className="flex pr-4 gap-2 whitespace-nowrap font-medium">
            <span className={secondaryTextColor}>Matching Engine </span>
            <span className="">
              {!isInitialLoadComplete ? (
                <StatusIcon status="pending-indefinite" label="Loading..." />
              ) : (
                <MatchingEngineStatusIcon matchingEngineStatus={matchingEngineStatus} component="matchingEngine" />
              )}
            </span>
          </div>
          <div className="flex pr-4 gap-2 whitespace-nowrap font-medium">
            <span className={secondaryTextColor}>Order Relay </span>
            <span className="">
              {!isInitialLoadComplete ? (
                <StatusIcon status="pending-indefinite" label="Loading..." />
              ) : (
                <MatchingEngineStatusIcon matchingEngineStatus={matchingEngineStatus} component="orderRelay" />
              )}
            </span>
          </div>
          <div className="flex pr-4 gap-2 whitespace-nowrap font-medium">
            <span className={secondaryTextColor}>Execution Engine </span>
            <span className="">
              {!isInitialLoadComplete ? (
                <StatusIcon status="pending-indefinite" label="Loading..." />
              ) : (
                <MatchingEngineStatusIcon matchingEngineStatus={matchingEngineStatus} component="executionEngine" />
              )}
            </span>
          </div>
        </div>
      </div> */}

      <div className="flex text-sm gap-3 px-5">
        <div className="flex space-x-7.5 overflow-auto scrollbar-hide">
          {tabs.map((e) => {
            return (
              <div key={e} className={twMerge('py-2.5', selectedTab === e ? `border-b-3 ${golderBorderColor}` : '')}>
                <div
                  className={twMerge(
                    selectedTab === e ? 'text-amber-900' : secondaryTextColor,
                    'hover:text-amber-900',
                    'font-semibold text-base cursor-pointer'
                  )}
                  onClick={() => {
                    setSelectedTab(e);
                    onTabChange(e);
                  }}
                >
                  {e}
                </div>
              </div>
            );
          })}
        </div>
        <Spacer />
        <div className="md:flex hidden text-sm divide-x divide-light-border dark:divide-dark-border items-center">
          {Number(floorPrice) > 0 && (
            <div className="flex items-end pr-4 gap-2 whitespace-nowrap font-medium">
              <span className={secondaryTextColor}>Floor </span>
              <span className="text-amber-700 leading-4.5 font-normal font-supply">
                {floorPrice ?? '-'} {EthSymbol}
              </span>
            </div>
          )}
          <div className="flex items-end items-center px-4 gap-2 whitespace-nowrap font-medium">
            <span className={secondaryTextColor}>Total Vol </span>
            <span className="text-amber-700 leading-4.5 font-normal font-supply">
              {totalVol ?? '-'} {EthSymbol}
            </span>
          </div>
          <div className="flex items-end px-4 gap-2 whitespace-nowrap font-medium">
            <span className={secondaryTextColor}>Owners </span>
            <span className="text-amber-700 leading-4.5 font-normal font-supply">{numOwners ?? '-'}</span>
          </div>
          <div className="flex items-end pl-4 gap-2 whitespace-nowrap font-medium">
            <span className={secondaryTextColor}>Items </span>
            <span className="text-amber-700 leading-4.5 font-normal font-supply">{numNfts ?? '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
