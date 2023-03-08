import { useRouter } from 'next/router';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { ClipboardButton, EZImage } from 'src/components/common';
import etherscanLogo from 'src/images/etherscan-logo.png';
import person from 'src/images/person.png';
import { ellipsisAddress, getChainScannerBase } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import {
  borderColor,
  brandBorderColor,
  hoverColor,
  hoverColorBrandText,
  secondaryBgColor,
  secondaryTextColor,
  smallIconButtonStyle
} from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { useNetwork } from 'wagmi';
import { AOutlineButton } from '../astra/astra-button';

export interface ProfileHeaderProps {
  expanded: boolean;
  tabs: string[];
}

export const ProfilePageHeader = ({ expanded, tabs }: ProfileHeaderProps) => {
  const router = useRouter();
  const addressFromPath = router.query?.address as string;
  const { chain } = useNetwork();
  const { selectedChain } = useAppContext();
  const chainId = String(chain?.id ?? selectedChain);
  const { selectedProfileTab, setSelectedProfileTab } = useAppContext();

  return (
    <div className={twMerge(borderColor, secondaryBgColor, 'px-6 pt-4')}>
      {expanded && (
        <>
          <div className="flex flex-col items-start">
            <div className="flex w-full items-center">
              <EZImage src={person.src} className="mr-4 h-14 w-14 rounded-lg overflow-clip" />

              <div className={twMerge('flex items-center mr-2')}>
                <div className="font-heading font-bold text-xl mr-2">
                  {ellipsisAddress(addressFromPath).toLowerCase()}
                </div>
                <div className={twMerge('cursor-pointer p-2 rounded-lg', hoverColor)}>
                  <ClipboardButton textToCopy={addressFromPath ?? ''} className={twMerge(smallIconButtonStyle)} />
                </div>
              </div>

              <AOutlineButton
                className={hoverColor}
                onClick={() => window.open(getChainScannerBase(chainId) + '/address/' + addressFromPath)}
              >
                <span className="flex items-center">
                  <EZImage src={etherscanLogo.src} className="mr-2 h-5 w-5 rounded-lg" />
                  <HiOutlineExternalLink className="text-md" />
                </span>
              </AOutlineButton>
            </div>
          </div>
        </>
      )}

      <div className="mt-6 flex space-x-5 text-sm">
        {tabs.map((e) => {
          return (
            <div
              key={e}
              className={twMerge('pb-2 px-3', selectedProfileTab === e ? `border-b-2 ${brandBorderColor}` : '')}
            >
              <div
                className={twMerge(
                  selectedProfileTab === e ? '' : secondaryTextColor,
                  hoverColorBrandText,
                  'font-medium cursor-pointer'
                )}
                onClick={() => {
                  setSelectedProfileTab(e);
                }}
              >
                {e}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
