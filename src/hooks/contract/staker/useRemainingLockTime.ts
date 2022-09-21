import { StakeAmount, StakeDuration, StakeInfo } from '@infinityxyz/lib-frontend/types/core';
import { calculateStatsBigInt, formatEth } from '@infinityxyz/lib-frontend/utils';
import { differenceInHours, differenceInMinutes } from 'date-fns';
import addDays from 'date-fns/addDays';
import differenceInDays from 'date-fns/differenceInDays';
import differenceInWeeks from 'date-fns/differenceInWeeks';
import { useMemo } from 'react';

/**
 * Maps a `StakeDuration` enum to the actual amount of months it represents.
 */
export const mapDurationToMonths = {
  [StakeDuration.None]: 0,
  [StakeDuration.ThreeMonths]: 3,
  [StakeDuration.SixMonths]: 6,
  [StakeDuration.TwelveMonths]: 12
};

// Days per month according to the contract.
const DAYS_PER_MONTH = 30;
export type DurationRemaining = { days: number; weeks: number; hours: number; minutes: number; seconds: number };
export type RemainingLockTime =
  | {
      timestamp: number;
      amount: string;
      isLocked: true;
      durationRemaining: DurationRemaining;
      stakeDuration: StakeDuration;
      unlockTimestamp: number;
    }
  | { timestamp: number; amount: string; isLocked: false; stakeDuration: StakeDuration; unlockTimestamp: number };

export const getLockRemainingDescription = (remainingLock: RemainingLockTime) => {
  if (!remainingLock.isLocked) {
    return `Unlocked`;
  }

  if (remainingLock.durationRemaining.weeks > 0) {
    return `${remainingLock.durationRemaining.weeks} weeks`;
  } else if (remainingLock.durationRemaining.days > 0) {
    return `${remainingLock.durationRemaining.days} days`;
  } else if (remainingLock.durationRemaining.hours > 0) {
    return `${remainingLock.durationRemaining.hours} hours`;
  } else if (remainingLock.durationRemaining.minutes > 0) {
    return `${remainingLock.durationRemaining.minutes} minutes`;
  } else {
    return `${remainingLock.durationRemaining.seconds} seconds`;
  }
};

/**
 * Calculates the remaining lock time of all tokens the user has staked.
 * @param address Optional user address.
 * @returns The total lock time in days and weeks.
 */
export function useRemainingLockTime(stakingInfo: StakeInfo | null): {
  maxLockTime: RemainingLockTime;
  stakeAmounts: RemainingLockTime[];
  unlockedAmount: number;
  lockedAmount: number;
} {
  const result = useMemo(() => {
    if (!stakingInfo) {
      return {
        maxLockTime: {
          timestamp: 0,
          amount: '0',
          isLocked: false,
          durationRemaining: {
            weeks: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
          },
          stakeDuration: StakeDuration.None,
          unlockTimestamp: 0
        },
        stakeAmounts: [],
        unlockedAmount: 0,
        lockedAmount: 0
      };
    }

    const getDurationRemaining = (stakeAmount: StakeAmount, duration: StakeDuration): RemainingLockTime => {
      const now = Date.now();
      const lockedFor = DAYS_PER_MONTH * mapDurationToMonths[duration] * 24 * 60 * 60 * 1000;
      const lockedUntil = stakeAmount.timestamp + lockedFor;

      const isLocked = lockedUntil > now;

      if (!isLocked) {
        return {
          timestamp: stakeAmount.timestamp,
          amount: stakeAmount.amount,
          isLocked: false,
          stakeDuration: duration,
          unlockTimestamp: lockedUntil
        };
      }

      const weeksRemaining = differenceInWeeks(lockedUntil, now);
      const remainingDays = differenceInDays(lockedUntil, addDays(now, weeksRemaining * 7));
      const remainingHours = differenceInHours(lockedUntil, addDays(now, weeksRemaining * 7 + remainingDays));
      const remainingMinutes = differenceInMinutes(
        lockedUntil,
        addDays(now, weeksRemaining * 7 + remainingDays + remainingHours)
      );
      const remainingSeconds = Math.floor((lockedUntil - now) / 1000) % 60;

      return {
        timestamp: stakeAmount.timestamp,
        amount: stakeAmount.amount,
        isLocked: true,
        durationRemaining: {
          weeks: weeksRemaining,
          days: remainingDays,
          hours: remainingHours,
          minutes: remainingMinutes,
          seconds: remainingSeconds
        },
        stakeDuration: duration,
        unlockTimestamp: lockedUntil
      };
    };

    const stakeAmounts = Object.keys(StakeDuration)
      .filter((v) => !isNaN(Number(v)))
      .map((duration) => {
        const info = stakingInfo[duration as unknown as StakeDuration];
        return getDurationRemaining(info, duration as unknown as StakeDuration);
      });

    const maxLockTime = stakeAmounts.sort((prev, curr) => {
      return prev.unlockTimestamp - curr.unlockTimestamp;
    })[stakeAmounts.length - 1];

    const unlockedAmountBigInt = calculateStatsBigInt(
      stakeAmounts.filter((item) => !item.isLocked),
      (item) => BigInt(item.amount)
    ).sum;

    const unlockedAmount = formatEth(unlockedAmountBigInt.toString());

    const lockedAmountBigInt = calculateStatsBigInt(
      stakeAmounts.filter((item) => item.isLocked),
      (item) => BigInt(item.amount)
    ).sum;

    const lockedAmount = formatEth(lockedAmountBigInt.toString());

    console.log(`UnlockedAmount: ${unlockedAmount}`);

    return {
      maxLockTime,
      stakeAmounts: stakeAmounts,
      unlockedAmount,
      lockedAmount
    };
  }, [stakingInfo]);

  return result;
}
