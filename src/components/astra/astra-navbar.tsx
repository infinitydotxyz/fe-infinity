import { useEffect, useState } from 'react';
import { AstraCartButton } from 'src/components/astra/astra-cart-button';
import { ConnectButton, EZImage, ExternalLink, NextLink, Spacer } from 'src/components/common';
import lightLogo from 'src/images/light-logo.png';
import darkLogo from 'src/images/dark-logo.png';
import { chainIdToName } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { borderColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { NetworkWarning } from '../common/network-warning';
import { CollectionSearchInput } from '../common/search/collection-search-input';
import { useTheme } from 'next-themes';

export const ANavbar = () => {
  const { selectedChain, isWalletNetworkSupported } = useAppContext();
  const [, setLabelVal] = useState(chainIdToName(selectedChain));
  const { theme } = useTheme();
  const [logoSrc, setLogoSrc] = useState(darkLogo.src);

  useEffect(() => {
    setLabelVal(chainIdToName(selectedChain));
  }, [selectedChain]);

  useEffect(() => {
    if (theme === 'dark') {
      setLogoSrc(darkLogo.src);
    } else {
      setLogoSrc(lightLogo.src);
    }
  }, [theme]);

  return (
    <div>
      <div className={isWalletNetworkSupported ? 'hidden' : 'block'}>
        <NetworkWarning />
      </div>
      <div className={twMerge('flex px-6 py-2 space-x-4 items-center border-b-[1px]', borderColor)}>
        <NextLink href="/">
          <EZImage src={logoSrc} className="w-12 h-12" />
        </NextLink>

        <div className="w-1/3">
          <CollectionSearchInput expanded />
        </div>

        <Spacer />

        <ExternalLink href="https://docs.pixl.so" className="text-sm underline">
          Docs
        </ExternalLink>

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

        <ConnectButton />

        <AstraCartButton />
      </div>
    </div>
  );
};
