import React from 'react';
import { twMerge } from 'tailwind-merge';

export type StatisticsProp = {
  label: string;
  value: string | number;
  className?: string;
};

export const Statistics: React.FC<StatisticsProp> = ({ label, value, className }) => {
  return (
    <span className={twMerge('space-x-2 inline-block', className)}>
      <strong className="font-heading font-black">{value}</strong>
      <span className="font-heading text-secondary font-light">{label}</span>
    </span>
  );
};

export const FeesAprStats: React.FC<Omit<StatisticsProp, 'label'>> = ({ value, ...props }) => (
  <Statistics label="Fee APR" value={`${value}%`} {...props} />
);

export const FeesAccruedStats: React.FC<Omit<StatisticsProp, 'label'>> = ({ value, ...props }) => (
  <Statistics label="Fees accrued" value={`$${value}`} {...props} />
);
