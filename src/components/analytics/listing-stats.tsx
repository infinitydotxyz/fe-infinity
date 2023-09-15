import { OrderStats } from 'src/hooks/api/useOrderRewardStats';
import { RewardsSection } from '../rewards/rewards-section';
import { twMerge } from 'tailwind-merge';
import { buttonBorderColor, primaryShadow } from 'src/utils/ui-constants';
import useScreenSize from 'src/hooks/useScreenSize';
import { nFormatter } from 'src/utils';
import { Spacer } from '../common';
import { Dispatch, SetStateAction, useState } from 'react';
import { DonutChart, DonutDataPoint } from '../charts/donut-chart';
import { useTopUsersByListingsDataSets } from 'src/hooks/api/useTopUsersByListingsDataSets';

interface Props {
  stats: OrderStats;
  userStats: OrderStats;
  showUserStats: boolean;
}
export function ListingStats({ stats, userStats, showUserStats }: Props) {
  const { isDesktop } = useScreenSize();

  const {
    topUsersByNumListingsDataSet,
    topUsersByNumActiveListingsDataSet,
    topUsersByNumListingsBelowFloorDataSet,
    topUsersByNumActiveListingsBelowFloorDataSet
  } = useTopUsersByListingsDataSets();

  const [selectedUserByNumListings, setSelectedUserByNumListings] = useState<null | DonutDataPoint>(null);
  const [selectedUserByNumActiveListings, setSelectedUserByNumActiveListings] = useState<null | DonutDataPoint>(null);
  const [selectedUserByNumListingsBelowFloor, setSelectedUserByNumListingsBelowFloor] = useState<null | DonutDataPoint>(
    null
  );
  const [selectedUserByNumActiveListingsBelowFloor, setSelectedUserByNumActiveListingsBelowFloor] =
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
          title="Listing totals"
          sideInfo={
            <div className={twMerge(buttonBorderColor, isDesktop && primaryShadow, 'md:border md:py-4 md:px-6')}>
              <div className="md:flex flex-wrap mt-4">
                <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                  <div className="md:text-2xl font-heading font-bold">{nFormatter(stats.numListings, 2)}</div>
                  <div className="text-sm mt-1">Listings</div>
                </div>
                <Spacer />

                <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                  <div className="md:text-2xl font-heading font-bold">{nFormatter(stats.numActiveListings, 2)}</div>
                  <div className="text-sm mt-1">Active listings</div>
                </div>
                <Spacer />

                <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                  <div className="md:text-2xl font-heading font-bold">
                    {nFormatter(stats.numActiveListingsBelowFloor, 2)}
                  </div>
                  <div className="text-sm mt-1">Active listings below floor</div>
                </div>
                <Spacer />

                <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                  <div className="md:text-2xl font-heading font-bold">{nFormatter(stats.numCancelledListings, 2)}</div>
                  <div className="text-sm mt-1">Cancelled listings</div>
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
            title="Your listing totals"
            sideInfo={
              <div className={twMerge(buttonBorderColor, isDesktop && primaryShadow, 'md:border md:py-4 md:px-6')}>
                <div className="md:flex flex-wrap mt-4">
                  <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                    <div className="md:text-2xl font-heading font-bold">{nFormatter(userStats.numListings, 2)}</div>
                    <div className="text-sm mt-1">Listings</div>
                  </div>
                  <Spacer />

                  <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                    <div className="md:text-2xl font-heading font-bold">
                      {nFormatter(userStats.numActiveListings, 2)}
                    </div>
                    <div className="text-sm mt-1">Active listings</div>
                  </div>
                  <Spacer />

                  <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                    <div className="md:text-2xl font-heading font-bold">
                      {nFormatter(userStats.numActiveListingsBelowFloor, 2)}
                    </div>
                    <div className="text-sm mt-1">Active listings below floor</div>
                  </div>
                  <Spacer />

                  <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                    <div className="md:text-2xl font-heading font-bold">
                      {nFormatter(userStats.numCancelledListings, 2)}
                    </div>
                    <div className="text-sm mt-1">Cancelled listings</div>
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
              title={topUsersByNumListingsDataSet.name}
              subTitle={''}
              dataSet={topUsersByNumListingsDataSet}
              selectedDataPoint={selectedUserByNumListings}
              onClick={handleDonutSelect(setSelectedUserByNumListings)}
            />
          </div>
          <div className="lg:flex-1 lg:ml-1 lg:max-w-[50%]">
            <DonutChart
              title={topUsersByNumActiveListingsDataSet.name}
              subTitle={''}
              dataSet={topUsersByNumActiveListingsDataSet}
              selectedDataPoint={selectedUserByNumActiveListings}
              onClick={handleDonutSelect(setSelectedUserByNumActiveListings)}
            />
          </div>
        </div>
      </div>

      <div className={twMerge('space-y-4 mt-6 pb-6')}>
        <div className="flex flex-col lg:flex-row mb-2 mx-2">
          <div className="mb-2 lg:mb-0 lg:flex-1 lg:mr-1 lg:max-w-[50%]">
            <DonutChart
              title={topUsersByNumListingsBelowFloorDataSet.name}
              subTitle={''}
              dataSet={topUsersByNumListingsBelowFloorDataSet}
              selectedDataPoint={selectedUserByNumListingsBelowFloor}
              onClick={handleDonutSelect(setSelectedUserByNumListingsBelowFloor)}
            />
          </div>
          <div className="lg:flex-1 lg:ml-1 lg:max-w-[50%]">
            <DonutChart
              title={topUsersByNumActiveListingsBelowFloorDataSet.name}
              subTitle={''}
              dataSet={topUsersByNumActiveListingsBelowFloorDataSet}
              selectedDataPoint={selectedUserByNumActiveListingsBelowFloor}
              onClick={handleDonutSelect(setSelectedUserByNumActiveListingsBelowFloor)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
