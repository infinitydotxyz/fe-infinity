import { accentColor, GraphData, accentAltColor, textColorTW, borderColor } from './graph-utils';
import { twMerge } from 'tailwind-merge';
import { Spacer } from 'src/components/common';

interface Props {
  graphData: GraphData[];
  className?: string;
}

export const OrderbookGraphInfo = ({ graphData, className }: Props) => {
  const listings = () => graphData.filter((x) => x.isSellOrder);
  const offers = () => graphData.filter((x) => !x.isSellOrder);

  return (
    <div className={twMerge(borderColor, ' text-sm rounded-lg flex items-center', textColorTW, className)}>
      <div className={twMerge('flex flex-col items-stretch')}>
        <div className="flex items-center  file:">
          <div className="h-4 w-4 mr-2 rounded-full border border-white" style={{ backgroundColor: accentAltColor }} />
          <div className="text-black text-opacity-80">Offers:</div>
        </div>

        <div className="flex items-center  ">
          <div className="h-4 w-4 mr-2 rounded-full border border-white" style={{ backgroundColor: accentColor }} />
          <div className="text-black text-opacity-80">Listings:</div>
        </div>
      </div>

      <div className="flex flex-col ml-4 text-right text-black ">
        <div className="font-bold">{offers().length.toString()}</div>
        <div className="font-bold">{listings().length.toString()}</div>
      </div>

      <Spacer />
      <div
        className={twMerge(
          borderColor,
          'text-[18px] w-10 bg-white  rounded-lg border shrink-0 font-bold flex justify-center text-black text-opacity-85 items-center    aspect-1'
        )}
      >
        <div>{graphData.length}</div>
      </div>
    </div>
  );
};
