import { buttonBorderColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface RewardsSectionProps {
  title: string;
  subTitle?: string;
  sideInfo?: React.ReactNode;
  children?: React.ReactNode;
}

export const RewardsSection = (props: RewardsSectionProps) => {
  return (
    <div
      className={twMerge(
        buttonBorderColor,
        'border flex-col p-4 md:px-10 w-full shadow-brand-primaryFade dark:shadow-brand-darkPrimaryFade shadow-sm'
      )}
    >
      <div className="md:flex w-full">
        <div className="md:w-1/2">
          <div className="text-2xl font-medium underline">{props.title}</div>
          {props.subTitle && <div className="md:w-1/2 mt-5">{props.subTitle}</div>}
        </div>
        {props?.sideInfo && <div className="md:w-1/2 md:mt-0 mt-4">{props.sideInfo}</div>}
      </div>
      {props.children && <div className="flex w-full mt-5">{props.children}</div>}
    </div>
  );
};
