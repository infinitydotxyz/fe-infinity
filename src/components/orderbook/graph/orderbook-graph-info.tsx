import { accentColor, GraphData, accentAltColor, textColorTW, borderColor } from './graph-utils';
import { twMerge } from 'tailwind-merge';

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
        <div className="flex items-center">
          <div
            className="h-4 w-4 mr-2 rounded-full border border-white"
            style={{ backgroundColor: `${accentAltColor}aa` }}
          />
          <div className=" text-gray-500  ">Offers:</div>
          <div className="font-bold ml-2 text-gray-600">{offers().length.toString()}</div>
        </div>

        <div className="flex items-center  ">
          <div
            className="h-4 w-4 mr-2 rounded-full border border-white"
            style={{ backgroundColor: `${accentColor}aa` }}
          />
          <div className="  text-gray-500 ">Listings:</div>
          <div className="font-bold ml-2 text-gray-600">{listings().length.toString()}</div>
        </div>
      </div>
    </div>
  );
};
