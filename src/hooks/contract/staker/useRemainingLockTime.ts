import { StakeDuration } from '@infinityxyz/lib-frontend/types/core';
import { useGetStakingInfo } from './useGetStakingInfo';
import addDays from 'date-fns/addDays';
import differenceInDays from 'date-fns/differenceInDays';
import differenceInWeeks from 'date-fns/differenceInWeeks';
import isBefore from 'date-fns/isBefore';
import { useMemo } from 'react';

/**
 * Maps a `StakeDuration` enum to the actual amount of months it represents.
 */
const mapDurationToMonths = {
  [StakeDuration.X0]: 0,
  [StakeDuration.X3]: 3,
  [StakeDuration.X6]: 6,
  [StakeDuration.X12]: 12
};

// Days per month according to the contract.
const DAYS_PER_MONTH = 30;

/**
 * Calculates the remaining lock time of all tokens the user has staked.
 * @param address Optional user address.
 * @returns The total lock time in days and weeks.
 */
export function useRemainingLockTime(address?: string) {
  const { info: stakingInfo = [] } = useGetStakingInfo(address);
  const result = useMemo(() => {
    const result = {
      days: 0,
      weeks: 0
    };

    // Each 'duration' represents a StakeDuration.
    // For example, when i == 0 then i == StakeDuration.X0, when i == 1 then i == StakeDuration.X3, etc.
    for (let duration = 0; duration < stakingInfo.length; duration++) {
      const info = stakingInfo[duration];

      // The time when the user staked the tokens.
      const timestamp = new Date(info.timestamp.toNumber() * 1000);

      const now = Date.now();
      const endDate = addDays(timestamp, DAYS_PER_MONTH * mapDurationToMonths[duration as StakeDuration]);

      const diffDays = isBefore(now, endDate) ? differenceInDays(endDate, now) : 0;
      const diffWeeks = isBefore(now, endDate) ? differenceInWeeks(endDate, now) : 0;
      // console.log({ duration, diffDays, diffWeeks });

      result.days += diffDays;
      result.weeks += diffWeeks;
    }

    return result;
  }, [stakingInfo]);

  return result;
}
