import { DonutChartDataSet, DonutDataPoint } from 'src/components/charts/donut-chart';
import { useTopUsersByOrders } from './useTopUsersByOrders';
import { useEffect, useState } from 'react';
import { OrderStats } from './useOrderRewardStats';
import { ellipsisAddress } from 'src/utils';
import { useAccount } from 'wagmi';

export const useTopUsersByListingsDataSets = () => {
  const { address } = useAccount();
  const { topUsers: topUsersByNumListings } = useTopUsersByOrders('numListings');
  const { topUsers: topUsersByNumActiveListings } = useTopUsersByOrders('numActiveListings');
  const { topUsers: topUsersByNumListingsBelowFloor } = useTopUsersByOrders('numListingsBelowFloor');
  const { topUsers: topUsersByNumActiveListingsBelowFloor } = useTopUsersByOrders('numActiveListingsBelowFloor');

  const [topUsersByNumListingsDataSet, setTopUsersByNumListingsDataSet] = useState<DonutChartDataSet>({
    units: 'Listing',
    dataPoints: [],
    name: 'Top users by listings',
    showUnits: false,
    total: 0
  });

  const [topUsersByNumActiveListingsDataSet, setTopUsersByNumActiveListingsDataSet] = useState<DonutChartDataSet>({
    units: 'Active listing',
    dataPoints: [],
    name: 'Top users by active listings',
    showUnits: false,
    total: 0
  });

  const [topUsersByNumListingsBelowFloorDataSet, setTopUsersByNumListingsBelowFloorDataSet] =
    useState<DonutChartDataSet>({
      units: 'Listings below floor',
      dataPoints: [],
      name: 'Top users by listings below floor',
      showUnits: false,
      total: 0
    });

  const [topUsersByNumActiveListingsBelowFloorDataSet, setTopUsersByNumActiveListingsBelowFloorDataSet] =
    useState<DonutChartDataSet>({
      units: 'Active listings below floor',
      dataPoints: [],
      name: 'Top users by active listings below floor',
      showUnits: false,
      total: 0
    });

  const mapDataPoint =
    (value: keyof OrderStats) =>
    (item: OrderStats & { user: string }): DonutDataPoint => {
      return {
        id: item.user,
        label: address === item.user ? 'You' : ellipsisAddress(item.user, 6, 0),
        value: item[value],
        color: `#${item.user?.slice?.(2, 8)}`
      };
    };

  const toDataSet = (
    name: string,
    units: string,
    value: keyof OrderStats,
    {
      data,
      total
    }: {
      data: (OrderStats & { user: string })[];
      total: number;
    }
  ): DonutChartDataSet => {
    const dataPoints = data.map(mapDataPoint(value));
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
    setTopUsersByNumListingsDataSet(
      toDataSet('Top users by listings', 'Listings', 'numListings', topUsersByNumListings)
    );
  }, [topUsersByNumListings, address]);

  useEffect(() => {
    setTopUsersByNumActiveListingsDataSet(
      toDataSet('Top users by active listings', 'Listings', 'numActiveListings', topUsersByNumActiveListings)
    );
  }, [topUsersByNumActiveListings, address]);

  useEffect(() => {
    setTopUsersByNumListingsBelowFloorDataSet(
      toDataSet(
        'Top users by listings below floor',
        'Listings',
        'numListingsBelowFloor',
        topUsersByNumListingsBelowFloor
      )
    );
  }, [topUsersByNumListingsBelowFloor, address]);

  useEffect(() => {
    setTopUsersByNumActiveListingsBelowFloorDataSet(
      toDataSet(
        'Top users by active listings below floor',
        'Listings',
        'numActiveListingsBelowFloor',
        topUsersByNumActiveListingsBelowFloor
      )
    );
  }, [topUsersByNumActiveListingsBelowFloor, address]);

  return {
    topUsersByNumListingsDataSet,
    topUsersByNumActiveListingsDataSet,
    topUsersByNumListingsBelowFloorDataSet,
    topUsersByNumActiveListingsBelowFloorDataSet
  };
};
