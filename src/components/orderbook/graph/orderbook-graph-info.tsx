import { accentColor, GraphData, accentAltColor } from './graph-utils';
import { twMerge } from 'tailwind-merge';

interface Props {
  graphData: GraphData[];
  className?: string;
}

export const OrderbookGraphInfo = ({ graphData, className }: Props) => {
  const listings = () => graphData.filter((x) => x.isSellOrder);
  const offers = () => graphData.filter((x) => !x.isSellOrder);

  return (
    <div className={twMerge('w-full flex', className)}>
      <div className={twMerge('w-full flex flex-col  ml-6 text-lg', className)}>
        <div className="flex items-center ">
          <div className="h-5 w-5 mr-3 rounded-full" style={{ backgroundColor: accentAltColor }} />
          <div className="font-bold mr-2">{offers().length.toString()}</div>
          <div>Offers</div>
        </div>

        <div className="flex items-center">
          <div className="h-5 w-5 mr-3 rounded-full" style={{ backgroundColor: accentColor }} />
          <div className="font-bold mr-2">{listings().length.toString()}</div>
          <div>Listings</div>
        </div>
      </div>
    </div>
  );
};
