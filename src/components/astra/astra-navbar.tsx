import { AstraCartButton } from 'src/components/astra/astra-cart-button';
import { ConnectButton, Spacer } from 'src/components/common';
import { useAppContext } from 'src/utils/context/AppContext';
import { borderColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { NetworkWarning } from '../common/network-warning';
import { CollectionSearchInput } from '../common/search/collection-search-input';
import { useNetwork } from 'wagmi';
import { getReadableNetworkName } from 'src/utils';

export const ANavbar = () => {
  const { isWalletNetworkSupported } = useAppContext();
  const { chain } = useNetwork();
  const chainName = getReadableNetworkName(chain?.id || 1);

  return (
    <div>
      <div className={isWalletNetworkSupported ? 'hidden' : 'block'}>
        <NetworkWarning />
      </div>
      <div className={twMerge('md:flex px-6 py-2 md:space-x-4 items-center border-b-[1px]', borderColor)}>
        <div className="md:w-1/3 w-full">
          <CollectionSearchInput expanded />
        </div>

        <Spacer />

        {/* <ADropdown
          hasBorder={true}
          alignMenuRight={true}
          label={labelVal}
          innerClassName="w-40"
          // items={Object.values(ChainId).map((chainId) => ({
          //   label: chainIdToName(chainId),
          //   onClick: () => {
          //     setLabelVal(chainIdToName(chainId));
          //     setSelectedChain(chainId);
          //   }
          // }))}
          items={[
            {
              label: 'Ethereum (beta)',
              onClick: () => {
                setSelectedChain(ChainId.Mainnet);
              }
            },
            {
              label: 'Goerli',
              onClick: () => {
                setSelectedChain(ChainId.Goerli);
              }
            }
          ]}
        /> */}

        <div className="flex items-center justify-between md:space-x-4 md:mt-0 mt-2">
          <div className={twMerge('border-2 py-2 px-4', borderColor)}>{chainName}</div>
          <ConnectButton />
          <AstraCartButton />
        </div>
      </div>
    </div>
  );
};
