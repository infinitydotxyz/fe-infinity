import { round } from '@infinityxyz/lib-frontend/utils';
import React from 'react';
import { nFormatter } from 'src/utils';
import { secondaryBgColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

export type ProgressBarBaseProps = {
  className?: string;
  fillerClassName?: string;
  overlayClassName?: string;
};

export type ProgressBarAmountProps = {
  amount: number;
  max: number;
  units: string;
};

export type ProgressBarPercentProps = {
  percentage: number;
  total?: number | string;
};

export type ProgressBarProps = (ProgressBarAmountProps | ProgressBarPercentProps) & ProgressBarBaseProps;

const getPercentage = (props: ProgressBarProps): number => {
  let percentage: number;

  if ('percentage' in props) {
    percentage = props.percentage;
  } else {
    percentage = props.amount <= props.max ? (props.amount / props.max) * 100 : 100;
    if (Number.isNaN(percentage)) {
      percentage = 0;
    }
  }
  return round(percentage, 3);
};

const ProgressBarFiller = ({ percentage, className }: { percentage: number; className?: string }) => {
  return (
    <div
      className={twMerge(
        'bg-blue-300 rounded-sm font-normal py-4',
        percentage <= 98 ? 'rounded-r-none' : '',
        className
      )}
      style={{ maxWidth: `${percentage}%`, minWidth: percentage > 0 ? '0.25rem' : '0' }}
    ></div>
  );
};

const ProgressBarOverlay: React.FC<
  (ProgressBarAmountProps | ProgressBarPercentProps) & { className?: string; percentage: number }
> = (props) => {
  const showAmount = 'amount' in props;
  return (
    <div
      className={twMerge(
        'absolute flex flex-row justify-between align-between w-full pl-2 pr-2 font-heading font-bold h-full',
        `top-0.5`,
        props.className
      )}
    >
      {showAmount && (
        <div className="min-w-30 flex flex-row">
          <div className="mr-1">{nFormatter(round(props.amount, 2))}</div>
          <div className="mr-1">/</div>
          <div className="mr-2">{nFormatter(round(props.max, 2))}</div>
          <div className="font-normal">{props.units}</div>
        </div>
      )}
      <div className={twMerge('w-20 font-bold', showAmount ? 'text-right' : '')}>{props.percentage}%</div>
      {'total' in props && <div className={twMerge('font-bold', showAmount ? 'text-right' : '')}>{props.total}</div>}
    </div>
  );
};

export const ProgressBar: React.FC<ProgressBarProps> = (props) => {
  const { fillerClassName, overlayClassName, className, ...rest } = props;
  const percentage = getPercentage(props);
  return (
    <div className={twMerge(secondaryBgColor, 'rounded-sm w-full relative min-w-62.5', `text-xl`, className)}>
      <ProgressBarFiller percentage={percentage} className={fillerClassName} />
      <ProgressBarOverlay className={overlayClassName} {...rest} percentage={percentage} />
    </div>
  );
};
