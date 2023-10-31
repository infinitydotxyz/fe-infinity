import { nFormatter } from 'src/utils';
import { Checkbox } from '../common';
import { RewardsSection } from '../rewards/rewards-section';
import { analyticsSectionItemLabel, analyticsSectionItemValue } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
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
  const tokenItemClassname =
    'lg:w-1/6 sm:w-full gap-1 flex flex-1  flex-row-reverse w-full md:flex-col items-center justify-between text-sm mt-2.5 first:mt-0 md:mt-0';
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
            <div className={twMerge(' h-full md:p-5')}>
              <div className="md:flex items-center flex-wrap h-full justify-center xl:justify-between gap-3 xl:gap-1">
                <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/6')}>
                  <div className={analyticsSectionItemValue}>{nFormatter(stats.volume, 2)}</div>
                  <div className={analyticsSectionItemLabel}>Buy volume USD</div>
                </div>

                <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/6')}>
                  <div className={analyticsSectionItemValue}>{nFormatter(stats.nativeVolume, 2)}</div>
                  <div className={analyticsSectionItemLabel}>Native buy volume USD</div>
                </div>

                <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/6')}>
                  <div className={analyticsSectionItemValue}>{nFormatter(stats.numBuys, 2)}</div>
                  <div className={analyticsSectionItemLabel}>Buys</div>
                </div>

                <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/6')}>
                  <div className={analyticsSectionItemValue}>{nFormatter(stats.numNativeBuys, 2)}</div>
                  <div className={analyticsSectionItemLabel}>Native buys</div>
                </div>
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
              <div className={twMerge(' h-full md:p-5')}>
                <div className="md:flex items-center flex-wrap h-full justify-center xl:justify-between gap-3 xl:gap-1">
                  <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/6')}>
                    <div className={analyticsSectionItemValue}>{nFormatter(userStats.volume, 2)}</div>
                    <div className={analyticsSectionItemLabel}>Buy volume USD</div>
                  </div>

                  <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/6')}>
                    <div className={analyticsSectionItemValue}>{nFormatter(userStats.nativeVolume, 2)}</div>
                    <div className={analyticsSectionItemLabel}>Native buy volume USD</div>
                  </div>

                  <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/6')}>
                    <div className={analyticsSectionItemValue}>{nFormatter(userStats.numBuys, 2)}</div>
                    <div className={analyticsSectionItemLabel}>Buys</div>
                  </div>

                  <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/6')}>
                    <div className={analyticsSectionItemValue}>{nFormatter(userStats.numNativeBuys, 2)}</div>
                    <div className={analyticsSectionItemLabel}>Native buys</div>
                  </div>
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
