import { nFormatter } from 'src/utils';
import { Checkbox, Spacer } from '../common';
import { RewardsSection } from '../rewards/rewards-section';
import { buttonBorderColor, primaryShadow } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import useScreenSize from 'src/hooks/useScreenSize';
import { DonutChart, DonutDataPoint } from '../charts/donut-chart';
import { Dispatch, SetStateAction, useState } from 'react';
import { LineChart } from '../charts/line-chart';
import {
  AllBuyDataSetIds,
  AllVolumeDataSetIds,
  BuyDataSetIds,
  VolumeDataSetIds,
  useBuyRewardDataSets
} from 'src/hooks/api/useBuyRewardDataSets';
import { useTopBuyersDataSets } from 'src/hooks/api/useTopBuyersDataSets';

const BuyDataSetIdsToNames: Record<BuyDataSetIds, string> = {
  buys: 'Total',
  'native-buys': 'Native',
  'user-buys': 'Your Total',
  'user-native-buys': 'Your Native'
};

const VolumeDataSetIdsToNames: Record<VolumeDataSetIds, string> = {
  volume: 'Total',
  'native-volume': 'Native',
  'user-volume': 'Your Total',
  'user-native-volume': 'Your Native'
};

export function BuyStats() {
  const { isDesktop } = useScreenSize();

  const {
    aggregated: stats,
    userAvailable: showUserStats,
    userAggregated: userStats,
    buyDataSets,
    volumeDataSets,
    selectedVolumeDataSets,
    availableVolumeDataSets,
    availableBuyDataSets,
    selectedBuyDataSets,
    setSelectedBuyDataSets,
    setSelectedVolumeDataSets
  } = useBuyRewardDataSets();

  const {
    topUsersByVolumeDataSet,
    topUsersByNativeVolumeDataSet,
    topUsersByNumBuysDataSet,
    topUsersByNumNativeBuysDataSet
  } = useTopBuyersDataSets();

  const [selectedUserByBuys, setSelectedUserByBuys] = useState<null | DonutDataPoint>(null);
  const [selectedUserByNativeBuys, setSelectedUserByNativeBuys] = useState<null | DonutDataPoint>(null);
  const [selectedUserByVolume, setSelectedUserByVolume] = useState<null | DonutDataPoint>(null);
  const [selectedUserByNativeVolume, setSelectedUserByNativeVolume] = useState<null | DonutDataPoint>(null);
  const handleDonutSelect = (set: Dispatch<SetStateAction<DonutDataPoint | null>>) => (item: DonutDataPoint) => {
    set((prev) => {
      return prev && prev.id === item.id ? null : item;
    });
  };

  return (
    <>
      <div className="mb-4">
        <RewardsSection
          title="Buy totals"
          sideInfo={
            <div className={twMerge(buttonBorderColor, isDesktop && primaryShadow, 'md:border md:py-4 md:px-6')}>
              <div className="md:flex flex-wrap mt-4">
                <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                  <div className="md:text-2xl font-heading font-bold">{nFormatter(stats.volume, 2)}</div>
                  <div className="text-sm mt-1">Buy volume USD</div>
                </div>
                <Spacer />

                <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                  <div className="md:text-2xl font-heading font-bold">{nFormatter(stats.nativeVolume, 2)}</div>
                  <div className="text-sm mt-1">Native buy volume USD</div>
                </div>
                <Spacer />

                <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                  <div className="md:text-2xl font-heading font-bold">{nFormatter(stats.numBuys, 2)}</div>
                  <div className="text-sm mt-1">Buys</div>
                </div>
                <Spacer />

                <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                  <div className="md:text-2xl font-heading font-bold">{nFormatter(stats.numNativeBuys, 2)}</div>
                  <div className="text-sm mt-1">Native buys</div>
                </div>
                <Spacer />
              </div>
            </div>
          }
        ></RewardsSection>
      </div>
      {showUserStats && (
        <div className="mb-4">
          <RewardsSection
            title="Your buy totals"
            sideInfo={
              <div className={twMerge(buttonBorderColor, isDesktop && primaryShadow, 'md:border md:py-4 md:px-6')}>
                <div className="md:flex flex-wrap mt-4">
                  <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                    <div className="md:text-2xl font-heading font-bold">{nFormatter(userStats.volume, 2)}</div>
                    <div className="text-sm mt-1">Buy volume USD</div>
                  </div>
                  <Spacer />

                  <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                    <div className="md:text-2xl font-heading font-bold">{nFormatter(userStats.nativeVolume, 2)}</div>
                    <div className="text-sm mt-1">Native buy volume USD</div>
                  </div>
                  <Spacer />

                  <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                    <div className="md:text-2xl font-heading font-bold">{nFormatter(userStats.numBuys, 2)}</div>
                    <div className="text-sm mt-1">Buys</div>
                  </div>
                  <Spacer />

                  <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                    <div className="md:text-2xl font-heading font-bold">{nFormatter(userStats.numNativeBuys, 2)}</div>
                    <div className="text-sm mt-1">Native buys</div>
                  </div>
                  <Spacer />
                </div>
              </div>
            }
          ></RewardsSection>
        </div>
      )}

      <div className={twMerge('space-y-4 mt-6 pb-6')}>
        <div className="flex flex-col lg:flex-row mb-2 mx-2">
          <div className="mb-2 lg:mb-0 lg:flex-1 lg:mr-1 lg:max-w-1/2">
            <DonutChart
              title={topUsersByVolumeDataSet.name}
              subTitle={''}
              dataSet={topUsersByVolumeDataSet}
              selectedDataPoint={selectedUserByVolume}
              onClick={handleDonutSelect(setSelectedUserByVolume)}
            />
          </div>
          <div className="lg:flex-1 lg:ml-1 lg:max-w-1/2">
            <DonutChart
              title={topUsersByNativeVolumeDataSet.name}
              subTitle={''}
              dataSet={topUsersByNativeVolumeDataSet}
              selectedDataPoint={selectedUserByNativeVolume}
              onClick={handleDonutSelect(setSelectedUserByNativeVolume)}
            />
          </div>
        </div>
      </div>

      <div className={twMerge('space-y-4 mt-6 pb-6')}>
        <div className="flex flex-col lg:flex-row mb-2 mx-2">
          <div className="mb-2 lg:mb-0 lg:flex-1 lg:mr-1 lg:max-w-1/2">
            <DonutChart
              title={topUsersByNumBuysDataSet.name}
              subTitle={''}
              dataSet={topUsersByNumBuysDataSet}
              selectedDataPoint={selectedUserByBuys}
              onClick={handleDonutSelect(setSelectedUserByBuys)}
            />
          </div>
          <div className="lg:flex-1 lg:ml-1 lg:max-w-1/2">
            <DonutChart
              title={topUsersByNumNativeBuysDataSet.name}
              subTitle={''}
              dataSet={topUsersByNumNativeBuysDataSet}
              selectedDataPoint={selectedUserByNativeBuys}
              onClick={handleDonutSelect(setSelectedUserByNativeBuys)}
            />
          </div>
        </div>
      </div>

      <div className={twMerge('space-y-4 mt-6 pb-6 mb-16')}>
        <div className="flex flex-col lg:flex-row mb-2 mx-2">
          <div className="mb-2 lg:mb-0 lg:flex-1 lg:mr-1 lg:max-w-1/2">
            <LineChart dataSets={volumeDataSets} xAxisType="DATE" title="Buy Volume" subTitle="Last 30 days">
              <div className="flex gap-5 items-center mt-6">
                {AllVolumeDataSetIds.map((id) => {
                  return (
                    <div key={id}>
                      <Checkbox
                        label={VolumeDataSetIdsToNames[id]}
                        checked={selectedVolumeDataSets.includes(id)}
                        onChange={() => {
                          setSelectedVolumeDataSets((prev) => {
                            if (prev.includes(id)) {
                              return prev.filter((item) => item !== id);
                            }
                            return [...prev, id];
                          });
                        }}
                        disabled={!availableVolumeDataSets.includes(id)}
                      />
                    </div>
                  );
                })}
              </div>
            </LineChart>
          </div>
          <div className="lg:flex-1 lg:ml-1 lg:max-w-1/2">
            <LineChart dataSets={buyDataSets} xAxisType="DATE" title="Buys" subTitle="Last 30 days">
              <div className="flex gap-5 items-center mt-6">
                {AllBuyDataSetIds.map((id) => {
                  return (
                    <div key={id}>
                      <Checkbox
                        label={BuyDataSetIdsToNames[id]}
                        checked={selectedBuyDataSets.includes(id)}
                        onChange={() => {
                          setSelectedBuyDataSets((prev) => {
                            if (prev.includes(id)) {
                              return prev.filter((item) => item !== id);
                            }
                            return [...prev, id];
                          });
                        }}
                        disabled={!availableBuyDataSets.includes(id)}
                      />
                    </div>
                  );
                })}
              </div>
            </LineChart>
          </div>
        </div>
      </div>
    </>
  );
}
