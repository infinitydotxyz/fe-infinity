import { ConnectKitButton } from 'connectkit';
import { AButton } from '../astra/astra-button';
import { Wallet } from 'src/icons';
import { twMerge } from 'tailwind-merge';

export const ConnectButton = ({
  half = false,
  fullWidth = false,
  iconClassName
}: {
  half?: boolean;
  fullWidth?: boolean;
  iconClassName?: string;
}) => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <AButton
            primary
            onClick={show}
            className={twMerge(
              'text-base py-3.5 border-0 border-r-2 border-black/40 dark:bg-white dark:border-white px-5',
              half ? 'rounded-tl-4 rounded-bl-4' : 'rounded-4',
              fullWidth && 'w-full'
            )}
          >
            <div className="flex items-center gap-2.5">
              <Wallet className={twMerge('w-4.5 leading h-4.5 text-white dark:text-neutral-700', iconClassName)} />
              <p className="leading-4.5 text-base font-semibold">
                {isConnected ? ensName ?? truncatedAddress : 'Connect Wallet'}
              </p>
            </div>
          </AButton>
        );
      }}
    </ConnectKitButton.Custom>
  );
};
