import { useEffect, useState } from 'react';
import { AstraCartButton } from 'src/components/astra/astra-cart-button';
import { ConnectButton, EZImage, ExternalLink, NextLink, Spacer } from 'src/components/common';
import logoMark from 'src/images/logo-mark.svg';
import { chainIdToName } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { borderColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { NetworkWarning } from '../common/network-warning';
import { CollectionSearchInput } from '../common/search/collection-search-input';

export const ANavbar = () => {
  const { selectedChain, isWalletNetworkSupported } = useAppContext();
  const [, setLabelVal] = useState(chainIdToName(selectedChain));
  // const { theme } = useTheme();
  const logo = <EZImage src={logoMark.src} className="w-9 h-9" />;

  useEffect(() => {
    setLabelVal(chainIdToName(selectedChain));
  }, [selectedChain]);

  // useEffect(() => {
  //   if (theme === 'dark') {
  //     setLogo(<EZImage src={flowLogoDark.src} className="w-28 h-9" />);
  //   } else {
  //     setLogo(<EZImage src={flowLogoLight.src} className="w-28 h-9" />);
  //   }
  // }, [theme]);

  return (
    <div>
      <div className={isWalletNetworkSupported ? 'hidden' : 'block'}>
        <NetworkWarning />
      </div>
      <div className={twMerge('flex px-6 py-2 space-x-4 items-center border-b-[1px]', borderColor)}>
        <NextLink href="/trending">{logo}</NextLink>

        <div className="w-1/3">
          <CollectionSearchInput expanded />
        </div>

        <Spacer />

        <ExternalLink href="https://docs.pixelpack.io" className="text-sm underline">
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
