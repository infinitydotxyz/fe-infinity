// import { AstraCartButton } from 'src/components/astra/astra-cart-button';
import { ConnectButton, Spacer } from 'src/components/common';
import { useAppContext } from 'src/utils/context/AppContext';
import { twMerge } from 'tailwind-merge';
import { NetworkWarning } from '../common/network-warning';
import { CollectionSearchInput } from '../common/search/collection-search-input';
import { ShoppingBagButton } from '../common/shoping-bag-button';

export const ANavbar = () => {
  const { isWalletNetworkSupported } = useAppContext();

  return (
    <div>
      <div className={isWalletNetworkSupported ? 'hidden' : 'block'}>
        <NetworkWarning />
      </div>
      <div
        className={twMerge(
          'md:flex px-5 py-3.5 md:space-x-4 bg-zinc-500 dark:bg-neutral-800 items-center border-b border-gray-300 dark:border-neutral-200'
        )}
      >
        <div className="md:w-1/3 w-full">
          <CollectionSearchInput shortCuts={true} expanded />
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

        <div className="flex items-center justify-between md:mt-0 mt-2">
          <ConnectButton half />
          <ShoppingBagButton />
        </div>
      </div>
    </div>
  );
};
