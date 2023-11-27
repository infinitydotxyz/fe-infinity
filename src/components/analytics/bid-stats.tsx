import { OrderStats } from 'src/hooks/api/useOrderRewardStats';
import { RewardsSection } from '../rewards/rewards-section';
import { twMerge } from 'tailwind-merge';
import { analyticsSectionItemLabel, analyticsSectionItemValue } from 'src/utils/ui-constants';
import { nFormatter } from 'src/utils';
import { useTopUsersByBidsDataSets } from 'src/hooks/api/useTopUsersByBidsDataSets';
import { DonutChart, DonutDataPoint } from '../charts/donut-chart';
import { Dispatch, SetStateAction, useState } from 'react';
import { Spacer } from '../common';

interface Props {
  stats: OrderStats;
  userStats: OrderStats;
  showUserStats: boolean;
}
export function BidStats({ stats, userStats, showUserStats }: Props) {
  const {
    topUsersByNumBidsDataSet,
    topUsersByNumBidsNearFloorDataSet,
    topUsersByNumActiveBidsDataSet,
    topUsersByNumActiveBidsNearFloorDataSet
  } = useTopUsersByBidsDataSets();

  const tokenItemClassname =
    'lg:w-1/6 sm:w-full gap-1 flex flex-1  flex-row-reverse w-full md:flex-col items-start justify-between text-sm mt-2.5 first:mt-0 md:mt-0';

  const [selectedUserByNumBids, setSelectedUserByNumBids] = useState<null | DonutDataPoint>(null);
  const [selectedUserByNumActiveBids, setSelectedUserByNumActiveBids] = useState<null | DonutDataPoint>(null);
  const [selectedUserByNumBidsNearFloor, setSelectedUserByNumBidsNearFloor] = useState<null | DonutDataPoint>(null);
  const [selectedUserByNumActiveBidsNearFloor, setSelectedUserByNumActiveBidsNearFloor] =
    useState<null | DonutDataPoint>(null);

  const handleDonutSelect = (set: Dispatch<SetStateAction<DonutDataPoint | null>>) => (item: DonutDataPoint) => {
    set((prev) => {
      return prev && prev.id === item.id ? null : item;
    });
  };
  return (
    <div className="overflow-clip h-full">
      <div className="mb-5">
        <RewardsSection
          title="Bid totals"
          sideInfoClassName="md:min-h-25"
          sideInfo={
            <div className="h-full md:p-5">
              <div className="md:flex md:flex-col lg:flex-row items-center flex-wrap h-full justify-center xl:justify-between gap-3 xl:gap-1">
                <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/4')}>
                  <div className={analyticsSectionItemValue}>{nFormatter(stats.numBids, 2)}</div>
                  <div className={analyticsSectionItemLabel}>Bids</div>
                </div>
                <Spacer />
                <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/4')}>
                  <div className={analyticsSectionItemValue}>{nFormatter(stats.numActiveBids, 2)}</div>
                  <div className={analyticsSectionItemLabel}>Active bids</div>
                </div>
                <Spacer />
                <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/2')}>
                  <div className={analyticsSectionItemValue}>{nFormatter(stats.numActiveBidsNearFloor, 2)}</div>
                  <div className={analyticsSectionItemLabel}>Active bids near floor</div>
                </div>
                <Spacer />
                <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/4')}>
                  <div className={analyticsSectionItemValue}>{nFormatter(stats.numCancelledBids, 2)}</div>
                  <div className={analyticsSectionItemLabel}>Cancelled bids</div>
                </div>
              </div>
            </div>
          }
        ></RewardsSection>
      </div>

      {showUserStats && (
        <div className="mb-5">
          <RewardsSection
            title="Your bid totals"
            sideInfoClassName="md:min-h-25"
            sideInfo={
              <div className="h-full md:p-5">
                <div className="md:flex md:flex-col lg:flex-row items-center flex-wrap h-full justify-center xl:justify-between gap-3 xl:gap-1">
                  <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/4')}>
                    <div className={analyticsSectionItemValue}>{nFormatter(userStats.numBids, 2)}</div>
                    <div className={analyticsSectionItemLabel}>Bids</div>
                  </div>
                  <Spacer />
                  <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/4')}>
                    <div className={analyticsSectionItemValue}>{nFormatter(userStats.numActiveBids, 2)}</div>
                    <div className={analyticsSectionItemLabel}>Active bids</div>
                  </div>
                  <Spacer />
                  <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/2')}>
                    <div className={analyticsSectionItemValue}>{nFormatter(userStats.numActiveBidsNearFloor, 2)}</div>
                    <div className={analyticsSectionItemLabel}>Active bids near floor</div>
                  </div>
                  <Spacer />
                  <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/4')}>
                    <div className={analyticsSectionItemValue}>{nFormatter(userStats.numCancelledBids, 2)}</div>
                    <div className={analyticsSectionItemLabel}>Cancelled bids</div>
                  </div>
                </div>
              </div>
            }
          ></RewardsSection>
        </div>
      )}
      <div className={twMerge('space-y-4 pb-5')}>
        <div className="flex flex-col lg:flex-row">
          <div className="mb-4 lg:mb-0 lg:flex-1 lg:mr-2 lg:max-w-1/2">
            <DonutChart
              title={topUsersByNumBidsDataSet.name}
              subTitle={''}
              dataSet={topUsersByNumBidsDataSet}
              selectedDataPoint={selectedUserByNumBids}
              onClick={handleDonutSelect(setSelectedUserByNumBids)}
            />
          </div>
          <div className="lg:flex-1 lg:ml-2 lg:max-w-1/2">
            <DonutChart
              title={topUsersByNumActiveBidsDataSet.name}
              subTitle={''}
              dataSet={topUsersByNumActiveBidsDataSet}
              selectedDataPoint={selectedUserByNumActiveBids}
              onClick={handleDonutSelect(setSelectedUserByNumActiveBids)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pb-6">
        <div className="flex flex-col lg:flex-row">
          <div className="mb-4 lg:mb-0 lg:flex-1 lg:mr-2 lg:max-w-1/2">
            <DonutChart
              title={topUsersByNumBidsNearFloorDataSet.name}
              subTitle={''}
              dataSet={topUsersByNumBidsNearFloorDataSet}
              selectedDataPoint={selectedUserByNumBidsNearFloor}
              onClick={handleDonutSelect(setSelectedUserByNumBidsNearFloor)}
            />
          </div>
          <div className="lg:flex-1 lg:ml-2 lg:max-w-1/2">
            <DonutChart
              title={topUsersByNumActiveBidsNearFloorDataSet.name}
              subTitle={''}
              dataSet={topUsersByNumActiveBidsNearFloorDataSet}
              selectedDataPoint={selectedUserByNumActiveBidsNearFloor}
              onClick={handleDonutSelect(setSelectedUserByNumActiveBidsNearFloor)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
