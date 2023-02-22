import { secondaryBgColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { Spacer } from './spacer';

interface Props {
  distribution: { percent: number; label: string; value?: string | number; className?: string }[];
}

export const DistributionBar = ({ distribution }: Props) => {
  return (
    <div className={twMerge(secondaryBgColor, '  rounded-3xl px-5 py-3 w-full')}>
      {distribution.map((item, index) => {
        return (
          <div key={index} className="relative w-full">
            <div
              className={twMerge('text-sm font-normal rounded-r-3xl py-4 mt-1', item.className)}
              style={{ maxWidth: `${item.percent}%` }}
            ></div>
            <div className="absolute top-1 w-full">
              <div className="font-heading w-full flex items-center px-3">
                <div className="font-bold">{`${item.percent}%`}</div>
                <Spacer />
                <div className="text-right text-sm">{item.label}</div>
                {item?.value ? <div className="text-right ml-4 text-sm text-light">{item.value}</div> : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
