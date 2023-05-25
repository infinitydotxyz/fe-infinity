import { twMerge } from 'tailwind-merge';

export const NetworkWarning = () => {
  return (
    <div className={twMerge('flex justify-center px-4 py-2 text-sm text-white bg-yellow-600')}>
      Network unsupported.
    </div>
  );
};
