import { useEffect, useState } from 'react';
import { useTopBuyers } from './useTopBuyers';
import { DonutChartDataSet, DonutDataPoint } from 'src/components/charts/donut-chart';
import { SaleStats } from './useBuyRewardStats';
import { ellipsisAddress } from 'src/utils/common-utils';
import { useAccount } from 'wagmi';

export const useTopBuyersDataSets = () => {
  const { address } = useAccount();
  const { topBuyers: topBuyersByVolume } = useTopBuyers('volume');
  const { topBuyers: topBuyersByNativeVolume } = useTopBuyers('nativeVolume');
  const { topBuyers: topBuyersByNumBuys } = useTopBuyers('numBuys');
  const { topBuyers: topBuyersByNumNativeBuys } = useTopBuyers('numNativeBuys');

  const [topUsersByVolumeDataSet, setTopUsersByVolumeDataSet] = useState<DonutChartDataSet>({
    units: 'USD',
    dataPoints: [],
    name: 'Top users by buy volume',
    showUnits: true,
    total: 0
  });

  const [topUsersByNativeVolumeDataSet, setTopUsersByNativeVolumeDataSet] = useState<DonutChartDataSet>({
    units: 'USD',
    dataPoints: [],
    name: 'Top users by native buy volume',
    showUnits: true,
    total: 0
  });

  const [topUsersByNumBuysDataSet, setTopUsersByNumBuysDataSet] = useState<DonutChartDataSet>({
    units: 'Buys',
    dataPoints: [],
    name: 'Top users by num buys',
    showUnits: true,
    total: 0
  });

  const [topUsersByNumNativeBuysDataSet, setTopUsersByNumNativeBuysDataSet] = useState<DonutChartDataSet>({
    units: 'Buys',
    dataPoints: [],
    name: 'Top users by num native buys',
    showUnits: true,
    total: 0
  });

  const mapDataPoint = (item: SaleStats & { user: string }): DonutDataPoint => {
    return {
      id: item.user,
      label: address === item.user ? 'You' : ellipsisAddress(item.user, 6, 0),
      value: item.volume,
      color: `#${item.user?.slice?.(2, 8)}`
    };
  };

  const toDataSet = (
    name: string,
    units: string,
    {
      data,
      total
    }: {
      data: (SaleStats & { user: string })[];
      total: number;
    }
  ): DonutChartDataSet => {
    const dataPoints = data.map(mapDataPoint);
    const sum = dataPoints.reduce((acc, item) => {
      return acc + item.value;
    }, 0);
    const remainder = Math.max(total - sum, 0);

    dataPoints.push({
      id: 'other',
      label: 'Rest',
      value: remainder,
      color: '#808080'
    });
    return {
      units,
      dataPoints: dataPoints,
      name: name,
      showUnits: true,
      total: total
    };
  };

  useEffect(() => {
    setTopUsersByVolumeDataSet(toDataSet('Top users by buy volume', 'USD', topBuyersByVolume));
  }, [topBuyersByVolume, address]);

  useEffect(() => {
    setTopUsersByNativeVolumeDataSet(toDataSet('Top users by native buy volume', 'USD', topBuyersByNativeVolume));
  }, [topBuyersByNativeVolume, address]);

  useEffect(() => {
    setTopUsersByNumBuysDataSet(toDataSet('Top users by num buys', 'Buys', topBuyersByNumBuys));
  }, [topBuyersByNumBuys, address]);

  useEffect(() => {
    setTopUsersByNumNativeBuysDataSet(toDataSet('Top users by num native buys', 'Buys', topBuyersByNumNativeBuys));
  }, [topBuyersByNumNativeBuys, address]);

  return {
    topUsersByVolumeDataSet,
    topUsersByNativeVolumeDataSet,
    topUsersByNumBuysDataSet,
    topUsersByNumNativeBuysDataSet
  };
};
