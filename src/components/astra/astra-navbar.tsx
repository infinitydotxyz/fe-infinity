import { Button, NextLink, Spacer, SVG } from 'src/components/common';
import { largeIconButtonStyle } from 'src/utils/ui-constants';

// ========================================================================================

export const AstraNavbar = () => {
  return (
    <div className="flex px-4 py-3 items-center">
      <NextLink href="/" className="flex items-center">
        <SVG.miniLogo className={largeIconButtonStyle} />
        <div className="ml-4 text-2xl font-bold">Astra</div>
      </NextLink>
      <Spacer />
      <Button variant="outline">Connect</Button>
    </div>
  );
};
