import { ChainId } from '@infinityxyz/lib-frontend/types/core';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { AstraCartButton } from 'src/components/astra/astra-cart-button';
import { ConnectButton, NextLink, Spacer } from 'src/components/common';
import flowLogoDark from 'src/images/flow-logo-dark.svg';
import flowLogoLight from 'src/images/flow-logo-light.svg';
import flowLogoSmall from 'src/images/flow-logo-mark.png';
import { chainIdToName } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { borderColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { useNetwork } from 'wagmi';
import { NetworkWarning } from '../common/network-warning';
import { CollectionSearchInput } from '../common/search/collection-search-input';
import { ADropdown } from './astra-dropdown';
import useScreenSize from 'src/hooks/useScreenSize';
import { AImage } from './astra-image';

export const ANavbar = () => {
  const { selectedChain, setSelectedChain } = useAppContext();
  const { chain } = useNetwork();
  const chainId = String(chain?.id);
  const [labelVal, setLabelVal] = useState(chainIdToName(selectedChain));
  const { theme } = useTheme();
  const { screenSize } = useScreenSize();
  const imageRef = useRef<HTMLImageElement>(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isSavingSpace, setIsSavingSpace] = useState(false);

  useEffect(() => {
    if (imageRef.current) {
      if (screenSize === 'xs' || screenSize === 'sm') {
        imageRef.current.src = flowLogoSmall.src;
      } else if (theme === 'dark') {
        imageRef.current.src = flowLogoDark.src;
      } else {
        imageRef.current.src = flowLogoLight.src;
      }
    }
  }, [theme, screenSize]);

  useEffect(() => {
    switch (screenSize) {
      case 'xs': {
        setIsSearchExpanded(false);
        setIsSavingSpace(true);
        break;
      }
      default:
        setIsSearchExpanded(true);
        setIsSavingSpace(false);
        break;
    }
  }, [screenSize]);

  return (
    <div>
      {chain ? chainId !== selectedChain ? <NetworkWarning /> : null : null}
      <div
        className={twMerge(
          'flex px-4 py-[0.5rem] h-[4rem] min-h-[4rem] space-x-4 items-center border-b-[1px]',
          borderColor
        )}
      >
        <NextLink href="/trending">
          {<AImage ref={imageRef} src={flowLogoSmall.src} className={twMerge('w-[3rem] h-[3rem] md:w-[8rem]')} />}
        </NextLink>
        <CollectionSearchInput
          expanded={isSearchExpanded}
          setExpanded={(value) => {
            if (screenSize !== 'xs' && !value) {
              return;
            }
            setIsSearchExpanded(value);
          }}
        />

        <Spacer />

        <ADropdown
          className={isSavingSpace && isSearchExpanded ? 'hidden' : ''}
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

        <div className={isSavingSpace && isSearchExpanded ? 'hidden' : ''}>
          <ConnectButton />
        </div>

        <AstraCartButton />
      </div>
    </div>
  );
};
