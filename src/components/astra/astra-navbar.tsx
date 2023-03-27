import { AstraCartButton } from 'src/components/astra/astra-cart-button';
import { borderColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { ConnectButton, EZImage, NextLink, Spacer } from 'src/components/common';
import { CollectionSearchInput } from '../common/search/collection-search-input';
import flowLogoDark from 'src/images/flow-logo-dark.svg';
import flowLogoLight from 'src/images/flow-logo-light.svg';
import { useState } from 'react';
import { ADropdown } from './astra-dropdown';
import { useAppContext } from 'src/utils/context/AppContext';
import { chainIdToName } from 'src/utils';
import { ChainId } from '@infinityxyz/lib-frontend/types/core';
import { useNetwork } from 'wagmi';
import { NetworkWarning } from '../common/network-warning';
import { useTheme } from 'next-themes';

export const ANavbar = () => {
  const { selectedChain, setSelectedChain } = useAppContext();
  const { chain } = useNetwork();
  const chainId = String(chain?.id);
  const [labelVal, setLabelVal] = useState(chainIdToName(selectedChain));
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  return (
    <div>
      {chain ? chainId !== selectedChain ? <NetworkWarning /> : null : null}
      <div className={twMerge('flex px-6 py-2 space-x-4 items-center border-b-[1px]', borderColor)}>
        <NextLink href="/trending">
          {darkMode ? (
            <EZImage src={flowLogoDark.src} className="w-28 h-9" />
          ) : (
            <EZImage src={flowLogoLight.src} className="w-28 h-9" />
          )}
        </NextLink>

        <div className="w-1/3">
          <CollectionSearchInput expanded />
        </div>

        <Spacer />

        <ADropdown
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
              label: 'Goerli',
              onClick: () => {
                setLabelVal(chainIdToName(ChainId.Goerli));
                setSelectedChain(ChainId.Goerli);
              }
            },
            {
              label: 'Ethereum (soon)',
              onClick: () => {
                // adi-todo uncomment
                // setLabelVal(chainIdToName(ChainId.Mainnet));
                // setSelectedChain(ChainId.Mainnet);
              }
            }
          ]}
        />

        <ConnectButton />

        <AstraCartButton />
      </div>
    </div>
  );
};
