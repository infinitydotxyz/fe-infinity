import NonSsrWrapper from 'src/components/astra/non-ssr-wrapper';
import { BlueCheckInline, ConnectButton, EZImage, EthPrice, NextLink } from 'src/components/common';
import { ChevronDown } from 'src/icons';
import NFTCards from 'src/images/nftcardstack.png';
import NFTCardsLight from 'src/images/nftcardstackwhite.png';
import Image from 'next/image';
import { apiGet, formatNumber, getNetworkName, nFormatter } from 'src/utils';
import { useEffect, useState } from 'react';
import { Collection, CollectionPeriodStatsContent, StatsPeriod } from '@infinityxyz/lib-frontend/types/core';
import { useIsMounted } from 'src/hooks/useIsMounted';
import { useAppContext } from 'src/utils/context/AppContext';
import { CartType, useCartContext } from 'src/utils/context/CartContext';
import { ERC721CollectionCartItem } from 'src/utils/types';
import useScreenSize from 'src/hooks/useScreenSize';
import { borderColor, heroSectionBGImage, heroSectionWidth } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import ChainSwitch from 'src/components/common/ChainSwitch';
import { AButton } from 'src/components/astra/astra-button';

const homeFeaturesList: { id: number; feature: string }[] = [
  { id: 1, feature: 'Listings from over 100 NFT marketplaces for instant buys.' },
  { id: 2, feature: 'Bids from over 100 marketplaces for instant sells.' },
  { id: 3, feature: 'Zero fees & royalties for token holders of $XFL, $BLUR, $LOOKS, $X2Y2, $SUDO.' },
  { id: 4, feature: 'Gas free batch listings, bids & cancellations.' },
  { id: 5, feature: 'Built on battle tested infra & audited contracts.' },
  { id: 6, feature: 'Mega gas optimized.' }
];

const HomePage = () => {
  const queryBy = 'by_sales_volume';
  const options = [
    { label: '1 day', value: StatsPeriod.Daily },
    { label: '7 days', value: StatsPeriod.Weekly },
    { label: '30 days', value: StatsPeriod.Monthly },
    { label: 'All Time', value: StatsPeriod.All }
  ];
  const [data, setData] = useState<Collection[]>([]);
  const [period] = useState(options[0]);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();
  const { isCollSelected, isCollSelectable, toggleCollSelection } = useAppContext();
  const { setCartType } = useCartContext();
  const { selectedChain } = useAppContext();

  const fetchData = async (refresh = false) => {
    const chainId = selectedChain;
    setIsLoading(true);
    if (refresh) {
      setData([]);
    }

    const { result } = await apiGet('/collections/stats', {
      query: {
        chainId,
        period: period.value,
        queryBy
      }
    });

    if (isMounted()) {
      setIsLoading(false);
      if (result?.data?.length > 0) {
        if (refresh) {
          const newData = [...result.data];
          setData(newData);
        } else {
          const newData = [...data, ...result.data];
          setData(newData);
        }
      }
    }
  };

  useEffect(() => {
    fetchData(true);
    // }, [period, selectedChain]);
  }, [selectedChain]);

  return (
    <NonSsrWrapper>
      <div>
        {/* home top section */}
        <div className="relative overflow-hidden dark:bg-neutral-200">
          <div className={twMerge('absolute h-full ', heroSectionBGImage)}>
            <ChevronDown className="text-yellow-900 -rotate-90 h-300 w-225" />
          </div>
          <div className="bg-radial-back-no-image-light dark:bg-radial-back-no-image-dark absolute top-0 left-0 h-full w-full"></div>
          <div className={twMerge('grid grid-cols-2 mx-auto', heroSectionWidth)}>
            {/* Aggregator */}
            <div className="rounded-xl w-max border overflow-hidden dark:border-yellow-900/20 border-neutral-700/10 my-14">
              <div className="bg-card-header-90 p-2.5 dark:bg-none dark:bg-gray-500/70 backdrop-blur-2xl">
                <p className="text-4xl w-max font-supply font-semibold dark:text-white text-neutral-700 skew-x-14 h-4.5">
                  The Last
                </p>
                <h3 className="pl-1.5 w-max text-54 font-bold dark:text-white text-neutral-700 font-body">
                  Aggregator
                </h3>
              </div>
              <div className="pt-2.5 backdrop-blur-2xl">
                <div>
                  {homeFeaturesList.map((featureItems) => (
                    <div className="flex gap-2.5 py-2.5 px-5 items-center" key={featureItems.id}>
                      <ChevronDown className="-rotate-90 text-yellow-900 w-4.5 h-2.5 mb-0.5" />
                      <p className="text-17 font-normal font-supply dark:text-white text-neutral-700">
                        {featureItems.feature}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="p-5">
                  <ConnectButton iconClassName="text-yellow-900 dark:text-yellow-900" />
                </div>
              </div>
            </div>
            {/* cards stack */}
            <div className="flex">
              <Image src={NFTCards} className="dark:block hidden" alt="nft cards" height={565} width={808} />
              <Image src={NFTCardsLight} className="block dark:hidden" alt="nft cards" height={565} width={808} />
            </div>
          </div>
        </div>
        {/* home trending section */}
        <div className="px-5 mt-15">
          <div className="flex justify-between items-center">
            <h3 className="text-35 text-neutral-700 dark:text-white font-extrabold border-b-5 border-yellow-900 w-max font-body">
              Trending
            </h3>
            <ChainSwitch />
          </div>
          <div className="rounded-5 overflow-hidden mt-8">
            <div
              className="md:grid gap-2 justify-between items-center w-full bg-zinc-200 dark:bg-zinc-700 px-5 py-3.5 text-neutral-700 dark:text-neutral-300"
              style={{ gridTemplateColumns: 'minmax(0, 3fr) repeat(auto-fit, minmax(0, 1fr))' }}
            >
              <div className="pl-10">
                <p>Collection</p>
              </div>
              <div>
                <p>Volume</p>
              </div>
              <div>
                <p>Volume Change</p>
              </div>
              <div>
                <p>Floor</p>
              </div>
              <div>
                <p>Floor Change</p>
              </div>
              <div>
                <p>Tokens</p>
              </div>
            </div>
            {!isLoading && (
              <div className="space-y-0.5 ">
                {data.map((coll, index) => {
                  return (
                    <TrendingGridItem
                      key={`${coll?.chainId}:${coll?.address}`}
                      collection={coll}
                      isCollSelectable={isCollSelectable}
                      isCollSelected={isCollSelected}
                      onClickBuy={(selectedColl) => {
                        if (toggleCollSelection) {
                          setCartType(CartType.CollectionBid);
                          return toggleCollSelection(selectedColl);
                        }
                      }}
                      index={index}
                      period={period.value}
                    />
                  );
                })}
              </div>
            )}
            <div className="pt-5 pb-20">
              <AButton
                primary
                className={twMerge(
                  'text-base py-3.5 border-0 border-r-2 border-black/40 dark:border-black/40 px-5 rounded-4 !bg-neutral-200 !text-white'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <ChevronDown className={twMerge('w-4.5 leading h-4.5 text-yellow-700 -rotate-90')} />
                  <p className="leading-4.5 text-base font-semibold">See What’s Trending</p>
                </div>
              </AButton>
            </div>
          </div>
        </div>
      </div>
    </NonSsrWrapper>
  );
};

export default HomePage;

// =======================================================================

interface Props {
  collection: Collection;
  period: StatsPeriod;
  index: number;
  onClickBuy: (data: ERC721CollectionCartItem) => void;
  isCollSelected: (data: ERC721CollectionCartItem) => boolean;
  isCollSelectable: (data: ERC721CollectionCartItem) => boolean;
}

const propertyClassname = 'md:flex-col flex text-amber-700 justify-between font-supply md:mt-0 mt-2';

export const TrendingGridItem = ({ collection, period, index }: Props) => {
  const { isDesktop } = useScreenSize();

  let periodStat: CollectionPeriodStatsContent | undefined = undefined;
  if (period === StatsPeriod.Daily) {
    periodStat = collection?.stats?.daily;
  } else if (period === StatsPeriod.Weekly) {
    periodStat = collection?.stats?.weekly;
  } else if (period === StatsPeriod.Monthly) {
    periodStat = collection?.stats?.monthly;
  } else if (period === StatsPeriod.All) {
    periodStat = collection?.stats?.all;
  }
  const floorPrice = periodStat?.floorPrice ?? 0;
  const floorPriceChange = Number(nFormatter(periodStat?.floorPriceChange ?? 0));
  const salesVolumeChange = Number(nFormatter(periodStat?.salesVolumeChange ?? 0));

  return (
    <div className={twMerge(borderColor, 'py-3.5 px-5 md:flex items-center bg-zinc-300 dark:bg-neutral-800')}>
      <div
        className="md:grid gap-2 justify-between items-center w-full"
        style={{ gridTemplateColumns: 'minmax(0, 3fr) repeat(auto-fit, minmax(0, 1fr))' }}
      >
        <div className="flex items-center font-bold font-heading">
          {isDesktop && (
            <div className="text-base font-semibold text-neutral-700 font-body mr-8 text-right">{index + 1}</div>
          )}

          <NextLink
            href={`/chain/${getNetworkName(collection?.chainId)}/collection/${collection?.slug || collection?.address}`}
            className="rounded-xl border border-gray-300 dark:border-neutral-900"
          >
            <EZImage className="w-10.5 rounded-xl h-10.5 overflow-clip" src={collection?.metadata?.profileImage} />
          </NextLink>

          <NextLink
            href={`/chain/${getNetworkName(collection?.chainId)}/collection/${collection?.slug || collection?.address}`}
            className="ml-2 whitespace-normal text-base font-semibold dark:text-white"
          >
            {collection?.metadata?.name}
            {collection?.hasBlueCheck && <BlueCheckInline />}
          </NextLink>
        </div>

        <div className={propertyClassname}>
          <EthPrice label={`${periodStat?.salesVolume ? nFormatter(periodStat?.salesVolume) : '-'}`} />
        </div>

        <div className={propertyClassname}>
          {Number.isNaN(salesVolumeChange) ? '-' : <div className="">{salesVolumeChange} %</div>}
        </div>

        <div className={propertyClassname}>
          <EthPrice label={floorPrice > 0 ? formatNumber(floorPrice, 2) : '-'} />
        </div>

        <div className={propertyClassname}>
          {Number.isNaN(floorPriceChange) ? '-' : <div className="">{floorPriceChange} %</div>}
        </div>

        {isDesktop ? (
          <div className={propertyClassname}>
            <div>{nFormatter(periodStat?.tokenCount ?? 0)}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
