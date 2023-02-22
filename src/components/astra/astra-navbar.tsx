import { AstraCartButton } from 'src/components/astra/astra-cart-button';
import { borderColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { ConnectButton, EZImage, NextLink, Spacer } from 'src/components/common';
import { CollectionSearchInput } from '../common/search/collection-search-input';
import flowLogo from 'src/images/flow-logo.png';

export const ANavbar = () => {
  return (
    <div className={twMerge('flex px-6 py-2 space-x-4 items-center border-b-[1px]', borderColor)}>
      <NextLink href="/trending">
        <EZImage src={flowLogo.src} className="w-9 h-9" />
      </NextLink>

      <div className="w-4/12">
        <CollectionSearchInput expanded />
      </div>

      <Spacer />

      <ConnectButton />
      <AstraCartButton />
    </div>
  );
};
