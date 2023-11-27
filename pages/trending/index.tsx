import { Collection, CollectionPeriodStatsContent, StatsPeriod } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { AButton } from 'src/components/astra/astra-button';
import { AvFooter } from 'src/components/astra/astra-footer';
import { APageBox } from 'src/components/astra/astra-page-box';
import { BouncingLogo, CenterFixed, EZImage, EthPrice, NextLink, ToggleTab } from 'src/components/common';
import { useIsMounted } from 'src/hooks/useIsMounted';
import useScreenSize from 'src/hooks/useScreenSize';
import { BlueCheckIcon } from 'src/icons';
import { apiGet, formatNumber, getNetworkName, nFormatter } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { CartType, useCartContext } from 'src/utils/context/CartContext';
import { ERC721CollectionCartItem } from 'src/utils/types';
import { borderColor, iconButtonStyle } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

const TrendingPage = () => {
  const queryBy = 'by_sales_volume';
  const DEFAULT_TAB = '1 day';
  const options = [
    { label: '1 day', value: StatsPeriod.Daily },
    { label: '7 days', value: StatsPeriod.Weekly },
    { label: '30 days', value: StatsPeriod.Monthly },
    { label: 'All Time', value: StatsPeriod.All }
  ];
  const [data, setData] = useState<Collection[]>([]);
  const [period, setPeriod] = useState(options[0]);
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
  }, [period, selectedChain]);

  return (
    <APageBox title="Trending Collections" footer={<AvFooter />} showTitle={true}>
      <div>
        <ToggleTab
          className="font-heading"
          options={options.map((option) => option.label)}
          defaultOption={DEFAULT_TAB}
          onChange={(label) => setPeriod(options.find((option) => option.label === label) || options[0])}
          border={true}
        />
      </div>
      <div className="overflow-x-clip text-sm scrollbar-hide">
        <div className=" space-y-3.5 md:space-y-0.25 p-5 pb-20">
          {data.map((coll, index) => {
            return (
              <TrendingPageCard
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

        {isLoading && (
          <CenterFixed>
            <BouncingLogo />
          </CenterFixed>
        )}
      </div>
    </APageBox>
  );
};

export default TrendingPage;

// =======================================================================

interface Props {
  collection: Collection;
  period: StatsPeriod;
  index: number;
  onClickBuy: (data: ERC721CollectionCartItem) => void;
  isCollSelected: (data: ERC721CollectionCartItem) => boolean;
  isCollSelectable: (data: ERC721CollectionCartItem) => boolean;
}

const propertyClassname = 'inline-block w-1/2 md:w-auto flex-col md:flex justify-between md:mt-0 mt-2';

const TrendingPageCard = ({ collection, onClickBuy, isCollSelected, isCollSelectable, period, index }: Props) => {
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
    <div
      className={twMerge(
        borderColor,
        'py-3.75 px-5 md:flex items-center first:rounded-t-20 last:rounded-b-20 bg-zinc-300 dark:bg-neutral-800'
      )}
    >
      <div
        className="md:grid gap-2 justify-between items-center w-full"
        style={{ gridTemplateColumns: 'minmax(0, 3fr) repeat(auto-fit, minmax(0, 1fr))' }}
      >
        <div className="flex items-center md:justify-start justify-between md:mb-0 mb-3.5 font-bold">
          <div className="hidden md:block text-base mr-8 text-right text-neutral-700 dark:text-neutral-700">
            {index + 1}
          </div>
          <div className="flex items-center">
            <NextLink
              href={`/chain/${getNetworkName(collection?.chainId)}/collection/${
                collection?.slug || collection?.address
              }`}
            >
              <EZImage className="w-10.5 h-10.5 rounded-lg overflow-clip" src={collection?.metadata?.profileImage} />
            </NextLink>

            <NextLink
              href={`/chain/${getNetworkName(collection?.chainId)}/collection/${
                collection?.slug || collection?.address
              }`}
              className="ml-2.5 text-lg md:text-base font-semibold text-neutral-700 dark:text-white whitespace-normal"
            >
              {collection?.metadata?.name}
              {collection?.hasBlueCheck && <BlueCheckIcon className="inline ml-1.25 mb-0.5" />}
            </NextLink>
          </div>
          <div className="md:hidden block text-base text-right text-neutral-700 dark:text-neutral-700">{index + 1}</div>
        </div>

        <div className={twMerge(propertyClassname, 'mt-0')}>
          <div className="text-sm text-gray-800 font-medium">Volume</div>
          <EthPrice
            ethClassName="font-normal text-17 md:text-sm font-body leading-4.5 mr-0.5"
            className="font-supply md:leading-5 text-amber-700 font-normal text-sm md:text-17"
            label={`${periodStat?.salesVolume ? nFormatter(periodStat?.salesVolume) : '-'}`}
          />
        </div>

        <div className={twMerge(propertyClassname, 'mt-0')}>
          <div className="text-sm text-gray-800 line-clamp-1 font-medium">Volume Change</div>
          {Number.isNaN(salesVolumeChange) ? (
            '-'
          ) : (
            <div className="font-supply !text-amber-700 font-normal  text-sm md:text-17">{salesVolumeChange}%</div>
          )}
        </div>

        <div className={propertyClassname}>
          <div className="text-sm text-gray-800 font-medium">Floor</div>
          <EthPrice
            ethClassName="font-normal text-17 md:text-sm font-body leading-4.5 mr-0.5"
            className="font-supply md:leading-5 text-amber-700 font-normal text-sm md:text-17"
            label={floorPrice > 0 ? formatNumber(floorPrice, 2) : '-'}
          />
        </div>

        <div className={propertyClassname}>
          <div className="text-sm text-gray-800 line-clamp-1 font-medium">Floor Change</div>
          {Number.isNaN(floorPriceChange) ? (
            '-'
          ) : (
            <div className="font-supply !text-amber-700 font-normal text-sm md:text-17">{floorPriceChange}%</div>
          )}
        </div>

        {isDesktop ? (
          <div className={propertyClassname}>
            <div className="text-sm text-gray-800 font-medium">Tokens</div>
            <div className="font-supply text-amber-700 font-normal text-sm md:text-17">
              {nFormatter(periodStat?.tokenCount ?? 0)}
            </div>
          </div>
        ) : null}

        <div className="flex justify-end gap-2 md:mt-0 mt-3.5">
          <AButton
            primary
            className="px-5 dark:text-neutral-200 text-white py-2.5 rounded-6 md:w-auto w-full flex justify-center leading-3.5 dark:border-transparent font-semibold"
            onClick={() => {
              if (isCollSelectable(collection as ERC721CollectionCartItem)) {
                onClickBuy(collection as ERC721CollectionCartItem);
              }
            }}
          >
            {isCollSelected(collection as ERC721CollectionCartItem) ? (
              <AiOutlineCheckCircle className={iconButtonStyle} />
            ) : (
              'Bid'
            )}
          </AButton>
        </div>
      </div>
    </div>
  );
};
