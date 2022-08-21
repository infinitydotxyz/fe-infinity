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
  [StakeDuration.None]: 0,
  [StakeDuration.ThreeMonths]: 3,
  [StakeDuration.SixMonths]: 6,
  [StakeDuration.TwelveMonths]: 12
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
    const days = [];
    const weeks = [];

    // Each 'duration' represents a StakeDuration.
    // For example, when i == 0 then i == StakeDuration.None, when i == 1 then i == StakeDuration.ThreeMonths, etc.
    for (let duration = 0; duration < stakingInfo.length; duration++) {
      const info = stakingInfo[duration];

      // The time when the user staked the tokens.
      const timestamp = new Date(info.timestamp.toNumber() * 1000);

      const now = Date.now();
      const endDate = addDays(timestamp, DAYS_PER_MONTH * mapDurationToMonths[duration as StakeDuration]);

      const diffDays = isBefore(now, endDate) ? differenceInDays(endDate, now) : 0;
      const diffWeeks = isBefore(now, endDate) ? differenceInWeeks(endDate, now) : 0;
      // console.log({ duration, diffDays, diffWeeks });

      days.push(diffDays);
      weeks.push(diffWeeks);
    }

    // We only care about the longest time we still need to wait.
    // For example, if 11 months ago a user staked for a duration of 12 months
    // and staked for 3 months yesterday, that means he still needs to wait 3 more more months
    // and thus the fact that he staked for a big amount of time of 12 months isn't relevant anymore.
    return {
      days: Math.max(...days),
      weeks: Math.max(...weeks)
    };
  }, [stakingInfo]);

  return result;
}
