import { twMerge } from 'tailwind-merge';

interface Props {
  distribution: { percent: number; label: string; className?: string }[];
}

export const DistributionBar = ({ distribution }: Props) => {
  return (
    <div className="bg-gray-100 rounded-r-3xl w-full">
      {distribution.map((item) => {
        return (
          <div className="relative w-full">
            <div
              className={twMerge('text-sm font-normal rounded-r-3xl py-4', item.className)}
              style={{ maxWidth: `${item.percent}%` }}
            ></div>
            <div className="absolute top-1 z-5 w-full">
              <div className="space-x-2 px-1 pr-4 font-heading w-full flex align-between justify-between">
                <div className="w-[80px] m-0 font-bold">{`${item.percent}%`}</div>
                <div className="w-[200px] m-0 text-right">{item.label}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
