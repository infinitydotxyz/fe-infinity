import { ConnectButton, NextLink, Spacer, SVG } from 'src/components/common';
import { inputBorderColor, largeIconButtonStyle } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

// ========================================================================================

export const AstraNavbar = () => {
  return (
    // relative added to give it a different layer so shadow isn't wiped out by sidebar
    <div className={twMerge('flex px-8 py-3 items-center bg-slate-100 border-b shadow-md relative', inputBorderColor)}>
      <NextLink href="/" className="flex items-center">
        <SVG.miniLogo className={largeIconButtonStyle} />
        <div className="ml-4 text-2xl font-bold">Astra</div>
      </NextLink>
      <Spacer />
      <ConnectButton />
    </div>
  );
};
