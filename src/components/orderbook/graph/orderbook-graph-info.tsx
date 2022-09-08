import { accentColor, GraphData, accentAltColor, bgAltColorTW, textColorTW, borderColor } from './graph-utils';
import { twMerge } from 'tailwind-merge';

interface Props {
  graphData: GraphData[];
  className?: string;
}

export const OrderbookGraphInfo = ({ graphData, className }: Props) => {
  const listings = () => graphData.filter((x) => x.isSellOrder);
  const offers = () => graphData.filter((x) => !x.isSellOrder);

  return (
    <div className="">
      <div className={twMerge('  flex items-center', textColorTW, className)}>
        <div
          className={twMerge(
            'bg-white',
            'border-gray-300 border',
            'text-[18px] w-9 shrink-0 font-bold flex justify-center text-black text-opacity-85 items-center rounded-lg   aspect-1'
          )}
        >
          <div>{graphData.length}</div>
        </div>

        <div className={twMerge('w-full flex flex-col text-sm ml-2')}>
          <div className="flex items-center ">
            <div className="h-4 w-4 mr-2 rounded-md" style={{ backgroundColor: accentAltColor }} />
            <div>Offers</div>
            <div className="font-bold ml-2">{offers().length.toString()}</div>
          </div>

          <div className="flex items-center">
            <div className="h-4 w-4 mr-2 rounded-md" style={{ backgroundColor: accentColor }} />
            <div>Listings</div>
            <div className="font-bold ml-2">{listings().length.toString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
