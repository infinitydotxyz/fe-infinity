// import { AstraCartButton } from 'src/components/astra/astra-cart-button';
import { ConnectButton, EZImage, NextLink, Spacer } from 'src/components/common';
import { useAppContext } from 'src/utils/context/AppContext';
import { twMerge } from 'tailwind-merge';
import { NetworkWarning } from '../common/network-warning';
import { CollectionSearchInput } from '../common/search/collection-search-input';
import { ShoppingBagButton } from '../common/shoping-bag-button';
import lightLogo from 'src/images/light-logo.png';
import { AiOutlineMenu } from 'react-icons/ai';
import { SearchIcon } from 'src/icons';

export const ANavbar = ({ setSidebarOpen }) => {
  const { isWalletNetworkSupported } = useAppContext();

  return (
    <div>
      <div className={isWalletNetworkSupported ? 'hidden' : 'block'}>
        <NetworkWarning />
      </div>
      <div
        className={twMerge(
          'h-21.25 sm:h-full md:flex px-5 py-3.5 md:space-x-4 bg-zinc-500 dark:bg-neutral-800 items-center border-b border-gray-300 dark:border-neutral-200'
        )}
      >
        <div className="sm:hidden flex h-full items-center justify-between">
          <div className="flex items-center">
            <NextLink className="-ml-3" href="/">
              <EZImage src={lightLogo.src} className="w-16 h-16" />
            </NextLink>
            <div onClick={() => setSidebarOpen(true)} className="cursor-pointer text-amber-700 dark:text-white">
              <AiOutlineMenu size={27} />
            </div>
          </div>
          <div className="p-2.5 dark:border rounded-full flex items-center jusitfy-center bg-zinc-300 dark:bg-neutral-800 text-amber-700 dark:text-white">
            <SearchIcon className="h-5 w-5" />
          </div>
        </div>

        <div className="hidden md:w-1/3 sm:w-full">
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

        <div className="hidden sm:flex items-center justify-between md:mt-0 mt-2">
          <ConnectButton half />
          <ShoppingBagButton />
        </div>
        <div className="p-5 flex sm:hidden items-center justify-center bg-linear-back-dark fixed z-50 bottom-0 w-full left-0">
          <ConnectButton half />
          <ShoppingBagButton />
        </div>
      </div>
    </div>
  );
};
