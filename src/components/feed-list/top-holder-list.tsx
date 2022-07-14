import { BaseCollection } from '@infinityxyz/lib-frontend/types/core';
import { standardCard } from 'src/utils';
import { twMerge } from 'tailwind-merge';

const TopHolder = ({ index }: { index: number }) => {
  return (
    <div className={twMerge(standardCard, 'flex items-center')}>
      <div className="w-12 rounded-full max-w-18 h-12 p-3 bg-white px-5 font-bold"> {index}</div>
      <div className="flex flex-wrap justify-between flex-1">
        <div className="ml-5 py-1">
          <p className="text-theme-light-800 text-sm">Address</p>
          <p className="font-heading mt-1">0xi74920f…</p>
        </div>
        <div className="ml-5 py-1">
          <p className="text-theme-light-800 text-sm">Owned</p>
          <p className="font-heading mt-1">182</p>
        </div>
        <div className="ml-5 py-1 float-right">
          <p className="text-theme-light-800 text-sm">Percentage</p>
          <p className="font-heading mt-1">3.9748%</p>
        </div>
      </div>
    </div>
  );
};

interface Props {
  collection: BaseCollection;
}

export const TopHolderList = ({ collection }: Props) => {
  console.log(collection.chainId);
  return (
    <>
      <div className="text-3xl mb-6 mt-16">Top Holders</div>
      <TopHolder index={1} />
      <TopHolder index={2} />
      <TopHolder index={3} />
      <TopHolder index={4} />
      <TopHolder index={5} />
      <div className="text-center">
        <a className="underline font-heading cursor-pointer">View on Etherscan</a>
      </div>
    </>
  );
};
