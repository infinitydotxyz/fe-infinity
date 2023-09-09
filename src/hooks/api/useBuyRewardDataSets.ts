import {
  bidDataPointColor,
  hoveredDataPointColor,
  listingDataPointColor,
  saleDataPointColor
} from 'src/utils/ui-constants';
import { useBuyRewardStats } from './useBuyRewardStats';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { DataPoint, DataSet } from 'src/components/charts/line-chart';

export type BuyDataSetIds = 'buys' | 'native-buys' | 'user-buys' | 'user-native-buys';
export type VolumeDataSetIds = 'volume' | 'native-volume' | 'user-volume' | 'user-native-volume';
export const AllBuyDataSetIds: BuyDataSetIds[] = ['buys', 'native-buys', 'user-buys', 'user-native-buys'];
export const AllVolumeDataSetIds: VolumeDataSetIds[] = ['volume', 'native-volume', 'user-volume', 'user-native-volume'];

export const useBuyRewardDataSets = () => {
  const { address } = useAccount();

  const [selectedBuyDataSets, setSelectedBuyDataSets] = useState(AllBuyDataSetIds);
  const [selectedVolumeDataSets, setSelectedVolumeDataSets] = useState(AllVolumeDataSetIds);
  const [availableBuyDataSets, setAvailableBuyDataSets] = useState(AllBuyDataSetIds);
  const [availableVolumeDataSets, setAvailableVolumeDataSets] = useState(AllVolumeDataSetIds);

  const { historical, aggregated } = useBuyRewardStats();
  const { filters, historical: userHistoricalBuyRewards, aggregated: userAggregated, setFilters } = useBuyRewardStats();

  const [internalBuyDataSets, setInternalBuyDataSets] = useState<DataSet[]>([]);
  const [internalVolumeDataSets, setInternalVolumeDataSets] = useState<DataSet[]>([]);
  const [buyDataSets, setBuyDataSets] = useState<DataSet[]>([]);
  const [volumeDataSets, setVolumeDataSets] = useState<DataSet[]>([]);

  const updateBuyDataSets = (dataSets: DataSet[]) => {
    setInternalBuyDataSets((prev) => {
      const items = new Set();
      return [...dataSets, ...prev].filter((item) => {
        if (items.has(item.id)) {
          return false;
        }
        items.add(item.id);
        return true;
      });
    });
  };

  const updateVolumeDataSets = (dataSets: DataSet[]) => {
    setInternalVolumeDataSets((prev) => {
      const items = new Set();
      return [...dataSets, ...prev].filter((item) => {
        if (items.has(item.id)) {
          return false;
        }
        items.add(item.id);
        return true;
      });
    });
  };

  useEffect(() => {
    const dataSets = internalBuyDataSets.filter((item) => selectedBuyDataSets.includes(item.id as BuyDataSetIds));
    setBuyDataSets(dataSets);
  }, [selectedBuyDataSets, internalBuyDataSets, setBuyDataSets]);

  useEffect(() => {
    const dataSets = internalVolumeDataSets.filter((item) =>
      selectedVolumeDataSets.includes(item.id as VolumeDataSetIds)
    );
    setVolumeDataSets(dataSets);
  }, [selectedVolumeDataSets, internalVolumeDataSets, setVolumeDataSets]);

  useEffect(() => {
    const buys: DataPoint[] = historical.map((item) => {
      return {
        dataSetId: 'buys',
        id: `buys:${item.day}`,
        x: item.timestamp,
        y: item.numBuys
      };
    });

    const nativeBuys: DataPoint[] = historical.map((item) => {
      return {
        dataSetId: 'native-buys',
        id: `native-buys:${item.day}`,
        x: item.timestamp,
        y: item.numNativeBuys
      };
    });

    const dataSets = [
      {
        yUnits: 'Buys',
        dataPoints: buys,
        name: 'Buys',
        id: 'buys',
        color: saleDataPointColor,
        showUnits: false
      },
      {
        yUnits: 'Buys',
        dataPoints: nativeBuys,
        name: 'Native Buys',
        id: 'native-buys',
        color: bidDataPointColor,
        showUnits: false
      }
    ];
    updateBuyDataSets(dataSets);
  }, [historical]);

  useEffect(() => {
    const volume: DataPoint[] = historical.map((item) => {
      return {
        dataSetId: 'volume',
        id: `volume:${item.day}`,
        x: item.timestamp,
        y: item.volume
      };
    });

    const nativeVolume: DataPoint[] = historical.map((item) => {
      return {
        dataSetId: 'native-volume',
        id: `native-volume:${item.day}`,
        x: item.timestamp,
        y: item.nativeVolume
      };
    });

    const dataSets = [
      {
        yUnits: 'USD',
        dataPoints: volume,
        name: 'Volume',
        id: 'volume',
        color: saleDataPointColor,
        showUnits: true
      },
      {
        yUnits: 'USD',
        dataPoints: nativeVolume,
        name: 'Native Volume',
        id: 'native-volume',
        color: bidDataPointColor,
        showUnits: true
      }
    ];
    updateVolumeDataSets(dataSets);
  }, [historical]);

  useEffect(() => {
    if (!address) {
      return;
    }
    const buys: DataPoint[] = userHistoricalBuyRewards.map((item) => {
      return {
        dataSetId: 'user-buys',
        id: `user-buys:${item.day}`,
        x: item.timestamp,
        y: item.numBuys
      };
    });

    const nativeBuys: DataPoint[] = userHistoricalBuyRewards.map((item) => {
      return {
        dataSetId: 'user-native-buys',
        id: `user-native-buys:${item.day}`,
        x: item.timestamp,
        y: item.numNativeBuys
      };
    });

    const volume: DataPoint[] = historical.map((item) => {
      return {
        dataSetId: 'user-volume',
        id: `user-volume:${item.day}`,
        x: item.timestamp,
        y: item.volume
      };
    });

    const nativeVolume: DataPoint[] = historical.map((item) => {
      return {
        dataSetId: 'user-native-volume',
        id: `user-native-volume:${item.day}`,
        x: item.timestamp,
        y: item.nativeVolume
      };
    });

    const buyDataSets = [
      {
        yUnits: 'Buys',
        dataPoints: buys,
        name: 'Your Buys',
        id: 'user-buys',
        color: hoveredDataPointColor,
        showUnits: false
      },
      {
        yUnits: 'Buys',
        dataPoints: nativeBuys,
        name: 'Your Native Buys',
        id: 'user-native-buys',
        color: listingDataPointColor,
        showUnits: false
      }
    ];

    const volumeDataSets = [
      {
        yUnits: 'USD',
        dataPoints: volume,
        name: 'Your Volume',
        id: 'user-volume',
        color: hoveredDataPointColor,
        showUnits: true
      },
      {
        yUnits: 'USD',
        dataPoints: nativeVolume,
        name: 'Your Native Volume',
        id: 'user-native-volume',
        color: listingDataPointColor,
        showUnits: true
      }
    ];

    updateBuyDataSets(buyDataSets);
    updateVolumeDataSets(volumeDataSets);
  }, [userHistoricalBuyRewards]);

  useEffect(() => {
    if (address) {
      console.log(`Found Address ${address}`);
      if (filters.user === address) {
        return;
      }
      setFilters({ user: address });
      setAvailableBuyDataSets(AllBuyDataSetIds);
      setAvailableVolumeDataSets(AllVolumeDataSetIds);
    } else {
      console.log(`No Address!`);
      setInternalBuyDataSets((prev) =>
        prev.filter((item) => item.id === 'user-buys' || item.id === 'user-native-buys')
      );
      setInternalVolumeDataSets((prev) =>
        prev.filter((item) => item.id === 'user-volume' || item.id === 'user-native-volume')
      );
      setSelectedBuyDataSets(AllBuyDataSetIds.filter((item) => item !== 'user-buys' && item !== 'user-native-buys'));
      setSelectedVolumeDataSets(
        AllVolumeDataSetIds.filter((item) => item !== 'user-volume' && item !== 'user-native-volume')
      );
      setAvailableBuyDataSets(AllBuyDataSetIds.filter((item) => item !== 'user-buys' && item !== 'user-native-buys'));
      setAvailableVolumeDataSets(
        AllVolumeDataSetIds.filter((item) => item !== 'user-volume' && item !== 'user-native-volume')
      );
    }
  }, [address]);

  return {
    userAvailable: !!address,
    aggregated,
    userAggregated,
    buyDataSets,
    volumeDataSets,
    availableBuyDataSets,
    availableVolumeDataSets,
    setSelectedBuyDataSets,
    setSelectedVolumeDataSets,
    selectedBuyDataSets,
    selectedVolumeDataSets
  };
};
