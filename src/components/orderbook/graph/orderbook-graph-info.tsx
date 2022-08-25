import { blueColor, GraphData, orangeColor } from './graph-utils';
import { twMerge } from 'tailwind-merge';

interface Props {
  graphData: GraphData[];
  className?: string;
}

export const OrderbookGraphInfo = ({ graphData, className }: Props) => {
  const listings = () => graphData.filter((x) => x.isSellOrder);
  const offers = () => graphData.filter((x) => !x.isSellOrder);

  return (
    <div className={twMerge('w-full text-white text-opacity-70 flex   mb-4 ', className)}>
      <div className={twMerge('w-full flex flex-col  ml-6 text-lg', className)}>
        <div className="flex items-center ">
          <div className="h-5 w-5 mr-3 rounded-full" style={{ backgroundColor: orangeColor }} />
          <div className="font-bold mr-2">{offers().length.toString()}</div>
          <div>Offers</div>
        </div>

        <div className="flex items-center">
          <div className="h-5 w-5 mr-3 rounded-full" style={{ backgroundColor: blueColor }} />
          <div className="font-bold mr-2">{listings().length.toString()}</div>
          <div>Listings</div>
        </div>
      </div>
    </div>
  );
};
