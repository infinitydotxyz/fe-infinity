import { twMerge } from 'tailwind-merge';

export const NetworkWarning = () => {
  return (
    <div className={twMerge('flex justify-center px-4 py-2 text-sm text-white bg-red-600')}>
      Network mismatch. Make sure the chain your wallet is connected to is the same as the chain selected in the navbar.
    </div>
  );
};
