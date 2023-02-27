import { ConnectKitButton } from 'connectkit';
import { twMerge } from 'tailwind-merge';
import { AButton } from '../astra/astra-button';

interface Props {
  className?: string;
}

export const ConnectButton = ({ className }: Props) => {
  // return <ConnectKitButton />;

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <AButton primary onClick={show} className={twMerge('text-sm py-2 px-4', className)}>
            {isConnected ? ensName ?? truncatedAddress : 'Connect'}
          </AButton>
        );
      }}
    </ConnectKitButton.Custom>
  );
};
