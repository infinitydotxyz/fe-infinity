import React from 'react';
import { twMerge } from 'tailwind-merge';
import { getReadableNetworkName } from 'src/utils';
import { useNetwork } from 'wagmi';

const switchItems = [
  { id: 1, title: 'Polygon' },
  { id: 2, title: 'Ethereum' }
];

const ChainSwitch = () => {
  const { chain } = useNetwork();
  const chainName = getReadableNetworkName(chain?.id || 1);
  const switchButtonClass = 'p-2.5 border last:rounded-r-4 first:rounded-l-4';
  const inactiveButtonClass = 'bg-zinc-300 dark:bg-neutral-800 border-zinc-300 dark:border-neutral-800';
  const activeButtonClass = 'bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-neutral-200';
  return (
    <div className="rounded-4 text-base font-semibold text-neutral-700 dark:text-white overflow-hidden">
      {switchItems.map((switchItem) => (
        <button
          key={switchItem.id}
          className={twMerge(
            switchButtonClass,
            chainName === switchItem.title ? activeButtonClass : inactiveButtonClass
          )}
        >
          {switchItem.title}
        </button>
      ))}
    </div>
  );
};

export default ChainSwitch;
