import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useNetwork, useSwitchNetwork } from 'wagmi';

const ChainSwitch = () => {
  const { chain, chains } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const switchButtonClass = 'p-2.5 border last:rounded-r-4 first:rounded-l-4';
  const inactiveButtonClass = 'bg-zinc-300 dark:bg-neutral-800 border-zinc-300 dark:border-neutral-800';
  const activeButtonClass = 'bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-neutral-200';
  return (
    <div className="rounded-4 text-base font-semibold text-neutral-700 dark:text-white overflow-hidden">
      {chains.map((chainItem) => (
        <button
          disabled={!switchNetwork || chainItem.id === chain?.id}
          key={chainItem.id}
          onClick={() => switchNetwork?.(chainItem.id)}
          className={twMerge(switchButtonClass, chain?.id === chainItem.id ? activeButtonClass : inactiveButtonClass)}
        >
          {chainItem.name}
        </button>
      ))}
    </div>
  );
};

export default ChainSwitch;
