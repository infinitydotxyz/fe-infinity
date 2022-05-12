import { ConnectButton, NextLink, Spacer, SVG, ToggleTab, useToggleTab } from 'src/components/common';
import { inputBorderColor, largeIconButtonStyle } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

// ========================================================================================

export const AstraNavbar = () => {
  const { options, onChange, selected } = useToggleTab(['All', 'Top 100', 'Rare', 'Hot'], 'All');

  const tabBar = (
    <div className={twMerge(inputBorderColor, 'flex justify-center')}>
      <ToggleTab options={options} selected={selected} onChange={onChange} altStyle={true} equalWidths={false} />
    </div>
  );

  return (
    // relative added to give it a different layer so shadow isn't wiped out by sidebar
    <div className={twMerge('flex px-8 py-2 items-center bg-slate-200 border-b shadow-md relative', inputBorderColor)}>
      <NextLink href="/" className="flex items-center">
        <SVG.miniLogo className={largeIconButtonStyle} />
        <div className="ml-4 text-2xl font-bold">Astra</div>
      </NextLink>
      <Spacer />

      {tabBar}
      <Spacer />
      <ConnectButton />
    </div>
  );
};
