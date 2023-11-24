import { DonutChartDataSet, DonutDataPoint } from 'src/components/charts/donut-chart';
import { useTopUsersByOrders } from './useTopUsersByOrders';
import { useEffect, useState } from 'react';
import { OrderStats } from './useOrderRewardStats';
import { ellipsisAddress } from 'src/utils';
import { useAccount } from 'wagmi';

export const useTopUsersByBidsDataSets = () => {
  const { address } = useAccount();
  const { topUsers: topUsersByNumBids } = useTopUsersByOrders('numBids');
  const { topUsers: topUsersByNumActiveBids } = useTopUsersByOrders('numActiveBids');
  const { topUsers: topUsersByNumBidsNearFloor } = useTopUsersByOrders('numBidsNearFloor');
  const { topUsers: topUsersByNumActiveBidsNearFloor } = useTopUsersByOrders('numActiveBidsNearFloor');

  const [topUsersByNumBidsDataSet, setTopUsersByNumBidsDataSet] = useState<DonutChartDataSet>({
    units: 'Bids',
    dataPoints: [],
    name: 'Top users by bids',
    showUnits: false,
    total: 0
  });

  const [topUsersByNumActiveBidsDataSet, setTopUsersByNumActiveBidsDataSet] = useState<DonutChartDataSet>({
    units: 'Bids',
    dataPoints: [],
    name: 'Top users by active bids',
    showUnits: false,
    total: 0
  });

  const [topUsersByNumBidsNearFloorDataSet, setTopUsersByNumBidsNearFloorDataSet] = useState<DonutChartDataSet>({
    units: 'Bids',
    dataPoints: [],
    name: 'Top users by bids near floor',
    showUnits: false,
    total: 0
  });

  const [topUsersByNumActiveBidsNearFloorDataSet, setTopUsersByNumActiveBidsNearFloorDataSet] =
    useState<DonutChartDataSet>({
      units: 'Bids',
      dataPoints: [],
      name: 'Top users by active bids near floor',
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
    setTopUsersByNumBidsDataSet(toDataSet('Top Users by Bids', 'Bids', 'numBids', topUsersByNumBids));
  }, [topUsersByNumBids, address]);

  useEffect(() => {
    setTopUsersByNumActiveBidsDataSet(
      toDataSet('Top Users by Active Bids', 'Bids', 'numActiveBids', topUsersByNumActiveBids)
    );
  }, [topUsersByNumActiveBids, address]);

  useEffect(() => {
    setTopUsersByNumBidsNearFloorDataSet(
      toDataSet('Top Users by Bids Near Floor', 'Bids', 'numBidsNearFloor', topUsersByNumBidsNearFloor)
    );
  }, [topUsersByNumBidsNearFloor, address]);

  useEffect(() => {
    setTopUsersByNumActiveBidsNearFloorDataSet(
      toDataSet(
        'Top Users by Active Bids Near Floor',
        'Bids',
        'numActiveBidsNearFloor',
        topUsersByNumActiveBidsNearFloor
      )
    );
  }, [topUsersByNumActiveBidsNearFloor, address]);

  return {
    topUsersByNumBidsDataSet,
    topUsersByNumActiveBidsDataSet,
    topUsersByNumBidsNearFloorDataSet,
    topUsersByNumActiveBidsNearFloorDataSet
  };
};
