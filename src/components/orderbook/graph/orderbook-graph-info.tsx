import { accentColor, GraphData, accentAltColor, bgAltColorTW, textColorTW } from './graph-utils';
import { twMerge } from 'tailwind-merge';
import { GraphBox } from './graph-box';

interface Props {
  graphData: GraphData[];
  className?: string;
}

export const OrderbookGraphInfo = ({ graphData, className }: Props) => {
  const listings = () => graphData.filter((x) => x.isSellOrder);
  const offers = () => graphData.filter((x) => !x.isSellOrder);

  return (
    <GraphBox className="py-3">
      <div className={twMerge('  flex items-center', textColorTW, className)}>
        <div
          className={twMerge(
            bgAltColorTW,
            'text-[20px] w-12 font-bold flex justify-center text-white text-opacity-85 items-center rounded-lg   aspect-1'
          )}
        >
          <div>{graphData.length}</div>
        </div>
        <div className={twMerge('w-full flex flex-col  ml-4')}>
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
    </GraphBox>
  );
};
