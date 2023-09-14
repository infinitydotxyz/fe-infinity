import { OrderStats } from 'src/hooks/api/useOrderRewardStats';
import { RewardsSection } from '../rewards/rewards-section';
import { twMerge } from 'tailwind-merge';
import { buttonBorderColor, primaryShadow } from 'src/utils/ui-constants';
import useScreenSize from 'src/hooks/useScreenSize';
import { nFormatter } from 'src/utils';
import { Spacer } from '../common';
import { useTopUsersByBidsDataSets } from 'src/hooks/api/useTopUsersByBidsDataSets';
import { DonutChart, DonutDataPoint } from '../charts/donut-chart';
import { Dispatch, SetStateAction, useState } from 'react';

interface Props {
  stats: OrderStats;
  userStats: OrderStats;
  showUserStats: boolean;
}
export function BidStats({ stats, userStats, showUserStats }: Props) {
  const { isDesktop } = useScreenSize();

  const {
    topUsersByNumBidsDataSet,
    topUsersByNumBidsNearFloorDataSet,
    topUsersByNumActiveBidsDataSet,
    topUsersByNumActiveBidsNearFloorDataSet
  } = useTopUsersByBidsDataSets();

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
    <>
      <div className="mb-4">
        <RewardsSection
          title="Bid totals"
          sideInfo={
            <div className={twMerge(buttonBorderColor, isDesktop && primaryShadow, 'md:border md:py-4 md:px-6')}>
              <div className="md:flex flex-wrap mt-4">
                <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                  <div className="md:text-2xl font-heading font-bold">{nFormatter(stats.numBids, 2)}</div>
                  <div className="text-sm mt-1">Bids</div>
                </div>
                <Spacer />

                <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                  <div className="md:text-2xl font-heading font-bold">{nFormatter(stats.numActiveBids, 2)}</div>
                  <div className="text-sm mt-1">Active bids</div>
                </div>
                <Spacer />

                <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                  <div className="md:text-2xl font-heading font-bold">
                    {nFormatter(stats.numActiveBidsNearFloor, 2)}
                  </div>
                  <div className="text-sm mt-1">Active bids near floor</div>
                </div>
                <Spacer />

                <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                  <div className="md:text-2xl font-heading font-bold">{nFormatter(stats.numCancelledBids, 2)}</div>
                  <div className="text-sm mt-1">Cancelled bids</div>
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
            title="Your bid totals"
            sideInfo={
              <div className={twMerge(buttonBorderColor, isDesktop && primaryShadow, 'md:border md:py-4 md:px-6')}>
                <div className="md:flex flex-wrap mt-4">
                  <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                    <div className="md:text-2xl font-heading font-bold">{nFormatter(userStats.numBids, 2)}</div>
                    <div className="text-sm mt-1">Bids</div>
                  </div>
                  <Spacer />

                  <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                    <div className="md:text-2xl font-heading font-bold">{nFormatter(userStats.numActiveBids, 2)}</div>
                    <div className="text-sm mt-1">Active bids</div>
                  </div>
                  <Spacer />

                  <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                    <div className="md:text-2xl font-heading font-bold">
                      {nFormatter(userStats.numActiveBidsNearFloor, 2)}
                    </div>
                    <div className="text-sm mt-1">Active bids near floor</div>
                  </div>
                  <Spacer />

                  <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                    <div className="md:text-2xl font-heading font-bold">
                      {nFormatter(userStats.numCancelledBids, 2)}
                    </div>
                    <div className="text-sm mt-1">Cancelled bids</div>
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
          <div className="mb-2 lg:mb-0 lg:flex-1 lg:mr-1 lg:max-w-[50%]">
            <DonutChart
              title={topUsersByNumBidsDataSet.name}
              subTitle={''}
              dataSet={topUsersByNumBidsDataSet}
              selectedDataPoint={selectedUserByNumBids}
              onClick={handleDonutSelect(setSelectedUserByNumBids)}
            />
          </div>
          <div className="lg:flex-1 lg:ml-1 lg:max-w-[50%]">
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

      <div className={twMerge('space-y-4 mt-6 pb-6')}>
        <div className="flex flex-col lg:flex-row mb-2 mx-2">
          <div className="mb-2 lg:mb-0 lg:flex-1 lg:mr-1 lg:max-w-[50%]">
            <DonutChart
              title={topUsersByNumBidsNearFloorDataSet.name}
              subTitle={''}
              dataSet={topUsersByNumBidsNearFloorDataSet}
              selectedDataPoint={selectedUserByNumBidsNearFloor}
              onClick={handleDonutSelect(setSelectedUserByNumBidsNearFloor)}
            />
          </div>
          <div className="lg:flex-1 lg:ml-1 lg:max-w-[50%]">
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
    </>
  );
}
