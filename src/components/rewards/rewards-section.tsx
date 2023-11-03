import { buttonBorderColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface RewardsSectionProps {
  title: string;
  subTitle?: React.ReactNode | string;
  sideInfo?: React.ReactNode;
  children?: React.ReactNode;
  sideInfoClassName?: string;
}

export const RewardsSection = (props: RewardsSectionProps) => {
  return (
    <div
      className={twMerge(
        buttonBorderColor,
        'rounded-10 flex-col px-5 md:px-0 py-5 md:pr-3.75 bg-zinc-300 dark:bg-neutral-800 w-full  shadow-sm'
      )}
    >
      <div className="md:flex w-full">
        <div className="md:w-1/2 md:px-7.5 flex flex-col justify-center">
          <div className="text-22 text-neutral-700 dark:text-white font-bold leading-7">{props.title}</div>
          {props.subTitle && (
            <div className=" my-2.5 text-base text-neutral-700 dark:text-white font-medium">{props.subTitle}</div>
          )}
        </div>
        {props?.sideInfo && (
          <div
            className={twMerge(
              'md:w-1/2 md:mt-0 mt-4 px-8 py-6 md:py-0 sm:px-10 bg-light-borderLight dark:bg-zinc-700 md:min-h-[10px] rounded-lg',
              props.sideInfoClassName
            )}
          >
            {props.sideInfo}
          </div>
        )}
      </div>
      {props.children && <div className="flex w-full mt-5 px-7.5">{props.children}</div>}
    </div>
  );
};
