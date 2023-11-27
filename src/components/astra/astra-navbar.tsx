import { ConnectButton, EZImage, NextLink, Spacer } from 'src/components/common';
import { useAppContext } from 'src/utils/context/AppContext';
import { twMerge } from 'tailwind-merge';
import { NetworkWarning } from '../common/network-warning';
import { CollectionSearchInput } from '../common/search/collection-search-input';
import { ShoppingBagButton } from '../common/shoping-bag-button';
import lightLogo from 'src/images/light-logo.png';
import { AiOutlineMenu } from 'react-icons/ai';
import { MagnifyingGlassIcon } from 'src/icons';
import { useState } from 'react';
import { useNetwork } from 'wagmi';
import { AOutlineButton } from './astra-button';

type ANavbarPropType = {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export const ANavbar = ({ setSidebarOpen }: ANavbarPropType) => {
  const { isWalletNetworkSupported, showCart } = useAppContext();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const { chain } = useNetwork();
  const selectedChain = chain?.name;

  return (
    <div>
      <div className={isWalletNetworkSupported ? 'hidden' : 'block'}>
        <NetworkWarning />
      </div>
      <div className="sm:max-h-19 sm:h-full sm:flex px-5 py-5 md:space-x-4 bg-zinc-500 dark:bg-neutral-800 items-center border-b dark:border-b border-gray-300 dark:border-dark-border">
        <div className="hidden sm:block md:w-1/3 sm:w-1/2">
          <CollectionSearchInput expanded />
        </div>
        <div className="sm:hidden flex h-full items-center justify-between">
          <div className="flex items-center">
            <NextLink className="-ml-3" href="/">
              <EZImage src={lightLogo.src} className="w-16 h-16" />
            </NextLink>
            <div onClick={() => setSidebarOpen(true)} className="cursor-pointer text-amber-700 dark:text-white">
              <AiOutlineMenu size={27} />
            </div>
          </div>
          <div className="p-2.5 dark:border-none rounded-full flex items-center jusitfy-center bg-gray-100 dark:bg-gray-600 text-amber-700 dark:text-white">
            {!showSearchBar ? (
              <div onClick={() => setShowSearchBar(!showSearchBar)}>
                <MagnifyingGlassIcon
                  className={twMerge('flex-1 w-5 h-5 max-h-full text-amber-700')}
                ></MagnifyingGlassIcon>
              </div>
            ) : (
              <div className="block">
                <CollectionSearchInput expanded iconStyle="flex-1 w-5 h-5 max-h-full text-amber-700" />
              </div>
            )}
          </div>
        </div>
        <Spacer />
        <div className="hidden sm:flex items-center sm:mt-0 mt-2">
          <AOutlineButton disabled className="mr-2 cursor-default">
            <div>{selectedChain}</div>
          </AOutlineButton>
          <ConnectButton half />
          <ShoppingBagButton />
        </div>
        <div
          className={twMerge(
            'p-5 sm:hidden items-center justify-center bg-linear-back-dark fixed z-50 bottom-0 w-full left-0',
            showCart ? 'hidden' : 'flex'
          )}
        >
          <AOutlineButton disabled className="mr-2 cursor-default">
            <div>{selectedChain}</div>
          </AOutlineButton>
          <ConnectButton half fullWidth />
          <ShoppingBagButton />
        </div>
      </div>
    </div>
  );
};
