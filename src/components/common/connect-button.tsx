import { ConnectKitButton } from 'connectkit';
import { AButton } from '../astra/astra-button';

export const ConnectButton = () => {
  // return <ConnectKitButton />;

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <AButton primary onClick={show} className="text-sm py-2 px-4">
            {isConnected ? ensName ?? truncatedAddress : 'Connect'}
          </AButton>
        );
      }}
    </ConnectKitButton.Custom>
  );
};
