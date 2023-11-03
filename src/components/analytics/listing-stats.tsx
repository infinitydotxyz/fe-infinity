import { OrderStats } from 'src/hooks/api/useOrderRewardStats';
import { RewardsSection } from '../rewards/rewards-section';
import { twMerge } from 'tailwind-merge';
import { analyticsSectionItemLabel, analyticsSectionItemValue } from 'src/utils/ui-constants';
import { nFormatter } from 'src/utils';
import { Dispatch, SetStateAction, useState } from 'react';
import { DonutChart, DonutDataPoint } from '../charts/donut-chart';
import { useTopUsersByListingsDataSets } from 'src/hooks/api/useTopUsersByListingsDataSets';
import { Spacer } from '../common';

interface Props {
  stats: OrderStats;
  userStats: OrderStats;
  showUserStats: boolean;
}
export function ListingStats({ stats, userStats, showUserStats }: Props) {
  const {
    topUsersByNumListingsDataSet,
    topUsersByNumActiveListingsDataSet,
    topUsersByNumListingsBelowFloorDataSet,
    topUsersByNumActiveListingsBelowFloorDataSet
  } = useTopUsersByListingsDataSets();
  const tokenItemClassname =
    'lg:w-1/6 sm:w-full gap-1 flex flex-1  flex-row-reverse w-full md:flex-col items-start justify-between text-sm mt-2.5 first:mt-0 md:mt-0';

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
      <div className="mb-5">
        <RewardsSection
          title="Listing totals"
          sideInfoClassName="md:min-h-25"
          sideInfo={
            <div className={twMerge(' h-full md:px-5')}>
              <div className="md:flex md:flex-col lg:flex-row md:items-start lg:items-center flex-wrap h-full justify-center xl:justify-between gap-3 xl:gap-1">
                <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/6')}>
                  <div className={analyticsSectionItemValue}>{nFormatter(stats.numListings, 2)}</div>
                  <div className={analyticsSectionItemLabel}>Listings</div>
                </div>
                <Spacer />
                <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/6')}>
                  <div className={analyticsSectionItemValue}>{nFormatter(stats.numActiveListings, 2)}</div>
                  <div className={analyticsSectionItemLabel}>Active listings</div>
                </div>
                <Spacer />
                <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/6')}>
                  <div className={analyticsSectionItemValue}>{nFormatter(stats.numActiveListingsBelowFloor, 2)}</div>
                  <div className={analyticsSectionItemLabel}>Active listings below floor</div>
                </div>
                <Spacer />
                <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/6')}>
                  <div className={analyticsSectionItemValue}>{nFormatter(stats.numCancelledListings, 2)}</div>
                  <div className={analyticsSectionItemLabel}>Cancelled listings</div>
                </div>
              </div>
            </div>
          }
        ></RewardsSection>
      </div>

      {showUserStats && (
        <div className="mb-5">
          <RewardsSection
            title="Your listing totals"
            sideInfoClassName="md:min-h-25"
            sideInfo={
              <div className={twMerge(' h-full md:px-5')}>
                <div className="md:flex md:flex-col lg:flex-row md:items-start lg:items-center flex-wrap h-full justify-center xl:justify-between gap-3 xl:gap-1">
                  <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/6')}>
                    <div className={analyticsSectionItemValue}>{nFormatter(userStats.numListings, 2)}</div>
                    <div className={analyticsSectionItemLabel}>Listings</div>
                  </div>
                  <Spacer />
                  <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/6')}>
                    <div className={analyticsSectionItemValue}>{nFormatter(userStats.numActiveListings, 2)}</div>
                    <div className={analyticsSectionItemLabel}>Active listings</div>
                  </div>
                  <Spacer />
                  <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/6')}>
                    <div className={analyticsSectionItemValue}>
                      {nFormatter(userStats.numActiveListingsBelowFloor, 2)}
                    </div>
                    <div className={analyticsSectionItemLabel}>Active listings below floor</div>
                  </div>
                  <Spacer />
                  <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/6')}>
                    <div className={analyticsSectionItemValue}>{nFormatter(userStats.numCancelledListings, 2)}</div>
                    <div className={analyticsSectionItemLabel}>Cancelled listings</div>
                  </div>
                </div>
              </div>
            }
          ></RewardsSection>
        </div>
      )}

      <div className={twMerge('space-y-4 pb-5')}>
        <div className="flex flex-col lg:flex-row">
          <div className="mb-4 lg:mb-0 lg:flex-1 lg:mr-2 lg:max-w-[50%]">
            <DonutChart
              title={topUsersByNumListingsDataSet.name}
              subTitle={''}
              dataSet={topUsersByNumListingsDataSet}
              selectedDataPoint={selectedUserByNumListings}
              onClick={handleDonutSelect(setSelectedUserByNumListings)}
            />
          </div>
          <div className="lg:flex-1 lg:ml-2 lg:max-w-[50%]">
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

      <div className={twMerge('space-y-4 pb-6')}>
        <div className="flex flex-col lg:flex-row">
          <div className="mb-4 lg:mb-0 lg:flex-1 lg:mr-2 lg:max-w-[50%]">
            <DonutChart
              title={topUsersByNumListingsBelowFloorDataSet.name}
              subTitle={''}
              dataSet={topUsersByNumListingsBelowFloorDataSet}
              selectedDataPoint={selectedUserByNumListingsBelowFloor}
              onClick={handleDonutSelect(setSelectedUserByNumListingsBelowFloor)}
            />
          </div>
          <div className="lg:flex-1 lg:ml-2 lg:max-w-[50%]">
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
