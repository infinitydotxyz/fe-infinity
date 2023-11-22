import NonSsrWrapper from 'src/components/astra/non-ssr-wrapper';
import { ConnectButton, EZImage, EthPrice, NextLink } from 'src/components/common';
import { BlueCheckIcon, ChevronDown } from 'src/icons';
import NFTCardsLightMobile from 'src/images/nftcardstackwhitemobile.png';
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
import { ADropdown } from 'src/components/astra/astra-dropdown';
import { useRouter } from 'next/router';

const homeFeaturesList: { id: number; feature: string }[] = [
  { id: 1, feature: 'Listings from over 100 NFT marketplaces for instant buys.' },
  { id: 2, feature: 'Bids from over 100 marketplaces for instant sells.' },
  { id: 3, feature: 'Zero fees & royalties for token holders of $XFL, $BLUR, $LOOKS, $X2Y2, $SUDO.' },
  { id: 4, feature: 'Gas free batch listings, bids & cancellations.' },
  { id: 5, feature: 'Built on battle tested infra & audited contracts.' },
  { id: 6, feature: 'Mega gas optimized.' }
];
type Tabs = 'Polygon' | 'Ethereum';
const tabs = ['Polygon', 'Ethereum'] as Tabs[];
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
  const [selected, setSelected] = useState<Tabs>(tabs[0]);
  const isMounted = useIsMounted();
  const { isCollSelected, isCollSelectable, toggleCollSelection } = useAppContext();
  const { setCartType } = useCartContext();
  const { selectedChain } = useAppContext();
  const { isDesktop } = useScreenSize();
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
  const router = useRouter();
  return (
    <NonSsrWrapper>
      <div className="overflow-auto h-full">
        {/* home top section */}
        <div className="relative overflow-hidden bg-gray-100 sm:bg-zinc-300 dark:bg-dark-bg sm:dark:bg-neutral-200">
          <div className={twMerge('hidden sm:block absolute h-full ', heroSectionBGImage)}>
            <ChevronDown className="text-yellow-900 -rotate-90 h-78 w-225" />
          </div>
          <div className="hidden sm:block bg-radial-back-no-image-light dark:bg-radial-back-no-image-dark absolute top-0 left-0 h-full w-full"></div>

          <div className={twMerge('hidden sm:grid grid-cols-1 lg:grid-cols-2 mx-auto', heroSectionWidth)}>
            {/* Aggregator */}
            <div className=" rounded-xl border overflow-hidden dark:border-amber-300 border-neutral-700/10 my-8 z-10">
              <div className="bg-card-header-90  pt-2.5 dark:bg-none dark:bg-gray-500/70 backdrop-blur-2xl">
                <p className="text-4xl w-max font-supply pl-3 font-normal dark:text-white text-neutral-700 skew-x-14">
                  The Last
                </p>
                <h3 className="pl-4 w-max text-54 font-extrabold dark:text-white text-neutral-700 -mt-5 font-body">
                  Aggregator
                </h3>
              </div>
              <div className=" backdrop-blur-2xl bg-white/70 h-full dark:bg-gray-500/70">
                <div>
                  {homeFeaturesList.map((featureItems) => (
                    <div className="flex gap-2 py-1.5 px-2 items-center" key={featureItems.id}>
                      <ChevronDown className="-rotate-90 text-yellow-900 w-4.5 h-2.5 mb-0.5" />
                      <p className="text-base font-normal font-supply dark:text-white text-neutral-700">
                        {featureItems.feature}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="px-5 pt-2 pb-4">
                  <ConnectButton iconClassName="text-yellow-900 dark:text-yellow-700" />
                </div>
              </div>
            </div>
            {/* cards stack */}
            <div className="hidden blur-none lg:flex flex-1 justify-center">
              <div className="bg-center bg-[url(/images/nftcardstackwhite.png)] dark:hidden bg-contain bg-no-repeat h-full w-full"></div>
              <div className="bg-center bg-[url(/images/nftcardstackdark.png)] hidden dark:block bg-contain bg-no-repeat h-full w-full"></div>
            </div>
          </div>
          {/* home top section mobile view*/}
          <div className="flex sm:hidden flex-col gap-5 mt-5">
            <div className="md:p-2.5 p-0 flex flex-col items-center">
              <p className="text-29 -tracking-2.32 font-supply font-normal dark:text-white text-neutral-700">
                The Last
              </p>
              <h3 className="w-max text-39 font-extrabold dark:text-white text-neutral-700 -mt-5 font-body">
                Aggregator
              </h3>
            </div>
            <div className="flex justify-center max-w-250 mx-auto md:mx-none md:max-w-393">
              <Image src={NFTCardsLightMobile} alt="nft cards light mobile" width={393} height={579} />
            </div>
            <div>
              {homeFeaturesList.map((featureItems) => (
                <div className="flex gap-2.5 py-2.5 px-10 items-start" key={featureItems.id}>
                  <div className="w-4.5">
                    <ChevronDown className="-rotate-90 text-yellow-900 w-4.5 h-2.5 mt-2" />
                  </div>
                  <p className="text-17 font-normal font-supply dark:text-white text-neutral-700">
                    {featureItems.feature}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* home trending section */}
        <div className="px-5 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-35 text-neutral-700 dark:text-white font-extrabold border-b-5 border-yellow-900 w-max font-body">
              Trending
            </h3>
            {isDesktop ? (
              <ChainSwitch />
            ) : (
              <ADropdown
                label={selected}
                menuParentButtonClassName="py-1 px-2.5 bg-gray-100 border-gray-300 dark:bg-neutral-800 dark:border-neutral-200 rounded-4"
                menuButtonClassName="font-semibold text-neutral-700"
                innerClassName="w-30"
                items={tabs.map((option) => ({
                  label: option,
                  onClick: () => setSelected(option as Tabs)
                }))}
              />
            )}
          </div>
          <div className="rounded-5 overflow-hidden mt-5">
            <div
              className="hidden md:grid gap-2 justify-between items-start md:items-center w-full text-sm bg-zinc-200 dark:bg-zinc-700 px-5 py-3.75 leading-3 text-neutral-700 dark:text-neutral-300 font-medium"
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
              <div className="hidden lg:block">
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
            <div className="pt-5 text-center sm:text-left pb-20">
              <AButton
                primary
                className={twMerge(
                  'text-base py-3.5 border-0 border-r-2 border-black/40 dark:border-black/40 px-5 rounded-4 !bg-neutral-200 !text-white'
                )}
                onClick={() => {
                  router.push('/trending');
                }}
              >
                <div className="flex items-center  gap-2.5">
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

const propertyClassname = 'md:flex-col text-17 hidden sm:flex text-amber-700 justify-between font-supply md:mt-0 mt-2';

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
        <div className="flex items-center font-bold">
          <div className="text-base font-semibold text-neutral-700 font-body mr-8 text-right">{index + 1}</div>

          <NextLink
            href={`/chain/${getNetworkName(collection?.chainId)}/collection/${collection?.slug || collection?.address}`}
            className="rounded-xl border border-gray-300 dark:border-neutral-900"
          >
            <EZImage className="w-10.5 rounded-xl h-10.5 overflow-clip" src={collection?.metadata?.profileImage} />
          </NextLink>
          <div className="ml-2.5">
            <NextLink
              href={`/chain/${getNetworkName(collection?.chainId)}/collection/${
                collection?.slug || collection?.address
              }`}
              className="whitespace-normal text-base font-semibold text-neutral-700 dark:text-white"
            >
              {collection?.metadata?.name}
              {collection?.hasBlueCheck && <BlueCheckIcon className="inline ml-1.25 mb-0.5" />}
            </NextLink>
            <div className="flex gap-3.75 sm:hidden text-sm font-medium font-body text-neutral-700 dark:text-white">
              <div className="flex items-center">
                Floor
                <span className="text-amber-700 ml-1">
                  <EthPrice ethClassName="font-body" label={floorPrice > 0 ? formatNumber(floorPrice, 2) : '-'} />
                </span>
              </div>
              <div className="flex items-center">
                Volume
                <span className="text-amber-700 ml-1">
                  <EthPrice label={`${periodStat?.salesVolume ? nFormatter(periodStat?.salesVolume) : '-'}`} />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={propertyClassname}>
          <p className="md:hidden text-sm font-body font-medium text-neutral-700 dark:text-neutral-300">Floor</p>
          <EthPrice
            ethClassName="font-body text-sm font-normal"
            labelClassName="text-17"
            label={`${periodStat?.salesVolume ? nFormatter(periodStat?.salesVolume) : '-'}`}
          />
        </div>

        <div className={propertyClassname}>
          <p className="md:hidden text-sm font-body font-medium text-neutral-700 dark:text-neutral-300">
            Volume change
          </p>
          {Number.isNaN(salesVolumeChange) ? '-' : <div>{salesVolumeChange}%</div>}
        </div>

        <div className={propertyClassname}>
          <p className="md:hidden text-sm font-body font-medium text-neutral-700 dark:text-neutral-300">Floor change</p>
          <EthPrice
            ethClassName="font-body text-sm font-normal"
            labelClassName="text-17"
            label={floorPrice > 0 ? formatNumber(floorPrice, 2) : '-'}
          />
        </div>

        <div className={propertyClassname}>
          <p className="md:hidden text-sm font-body font-medium text-neutral-700 dark:text-neutral-300">Tokens</p>
          {Number.isNaN(floorPriceChange) ? '-' : <div>{floorPriceChange}%</div>}
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
