import { Collection, CollectionPeriodStatsContent, StatsPeriod } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { AButton } from 'src/components/astra/astra-button';
import { ADropdown } from 'src/components/astra/astra-dropdown';
import { APageBox } from 'src/components/astra/astra-page-box';
import {
  BlueCheckInline,
  BouncingLogo,
  CenterFixed,
  EZImage,
  EthPrice,
  NextLink,
  ToggleTab
} from 'src/components/common';
import { useIsMounted } from 'src/hooks/useIsMounted';
import useScreenSize from 'src/hooks/useScreenSize';
import { apiGet, formatNumber, nFormatter } from 'src/utils';
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
  const { isDesktop } = useScreenSize();
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
    <APageBox title="Trending Collections" showTitle={true}>
      <div className="overflow-y-auto overflow-x-clip text-sm scrollbar-hide">
        {isDesktop ? (
          <ToggleTab
            className="font-heading"
            options={options.map((option) => option.label)}
            defaultOption={DEFAULT_TAB}
            onChange={(label) => setPeriod(options.find((option) => option.label === label) || options[0])}
            border={true}
          />
        ) : (
          <ADropdown
            label={period.label}
            className="w-30"
            innerClassName="w-30"
            items={options.map((option) => ({
              label: option.label,
              onClick: () => setPeriod(option)
            }))}
          />
        )}

        <div className="space-y-3 mt-8 pb-20">
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

const propertyClassname = 'md:flex-col flex justify-between md:mt-0 mt-2';

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
    <div className={twMerge(borderColor, 'rounded-lg border p-2 md:flex items-center')}>
      <div
        className="md:grid gap-2 justify-between items-center w-full"
        style={{ gridTemplateColumns: 'minmax(0, 3fr) repeat(auto-fit, minmax(0, 1fr))' }}
      >
        <div className="flex items-center font-bold font-heading">
          {isDesktop && <div className="text-lg mr-8 text-right">{index + 1}</div>}

          <NextLink href={`/collection/${collection?.chainId}:${collection?.address}`}>
            <EZImage className="w-14 h-14 rounded-lg overflow-clip" src={collection?.metadata?.profileImage} />
          </NextLink>

          <NextLink
            href={`/collection/${collection?.chainId}:${collection?.address}`}
            className="ml-2 whitespace-normal"
          >
            {collection?.metadata?.name}
            {collection?.hasBlueCheck && <BlueCheckInline />}
          </NextLink>
        </div>

        <div className={propertyClassname}>
          <div className="text-sm font-bold">Vol</div>
          <EthPrice label={`${periodStat?.salesVolume ? nFormatter(periodStat?.salesVolume) : '-'}`} />
        </div>

        <div className={propertyClassname}>
          <div className="text-sm font-bold">Vol Change</div>
          {Number.isNaN(salesVolumeChange) ? (
            '-'
          ) : (
            <div className={twMerge(salesVolumeChange >= 0 ? 'text-green-600' : 'text-red-600')}>
              {salesVolumeChange} %
            </div>
          )}
        </div>

        <div className={propertyClassname}>
          <div className="text-sm font-bold">Floor</div>
          <EthPrice label={floorPrice > 0 ? formatNumber(floorPrice, 2) : '-'} />
        </div>

        <div className={propertyClassname}>
          <div className="font-bold">Floor Change</div>
          {Number.isNaN(floorPriceChange) ? (
            '-'
          ) : (
            <div className={twMerge(floorPriceChange >= 0 ? 'text-green-600' : 'text-red-600')}>
              {floorPriceChange} %
            </div>
          )}
        </div>

        {isDesktop ? (
          <div className={propertyClassname}>
            <div className=" text-sm font-bold ">Tokens</div>
            <div>{nFormatter(periodStat?.tokenCount ?? 0)}</div>
          </div>
        ) : null}

        <div className="flex gap-2">
          <AButton
            primary
            className="px-9 py-3 md:w-auto w-full md:mt-0 mt-2 flex justify-center"
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
