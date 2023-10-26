import { useRouter } from 'next/router';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { ClipboardButton, EZImage, ToggleTab } from 'src/components/common';
import etherscanLogo from 'src/images/etherscan-logo.png';
import { ellipsisAddress, getChainScannerBase } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { borderColor, hoverColor, smallIconButtonStyle } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { useNetwork } from 'wagmi';
import { AOutlineButton, ATextButton } from '../astra/astra-button';
import useScreenSize from 'src/hooks/useScreenSize';

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
  const { setSelectedProfileTab } = useAppContext();
  const { isDesktop } = useScreenSize();

  return (
    <div className={twMerge(borderColor)}>
      {expanded && (
        <>
          <div className="flex flex-col items-start px-5 ">
            <div className="flex w-full items-start justify-between">
              {/* <EZImage src={person.src} className="mr-4 h-12 w-12 rounded-full overflow-clip" /> */}

              <div className={twMerge('flex items-center mr-2 py-15')}>
                <div className="font-bold md:text-35 mr-2">{ellipsisAddress(addressFromPath).toLowerCase()}</div>
                <div className={twMerge('cursor-pointer p-2 rounded-lg', hoverColor)}>
                  <ClipboardButton textToCopy={addressFromPath ?? ''} className={twMerge(smallIconButtonStyle)} />
                </div>
              </div>
              <div className="p-2.5">
                {isDesktop ? (
                  <AOutlineButton
                    className={twMerge(hoverColor, 'border-0 py-2')}
                    onClick={() => window.open(getChainScannerBase(chainId) + '/address/' + addressFromPath)}
                  >
                    <span className="flex items-center">
                      <EZImage src={etherscanLogo.src} className="mr-2.5 h-5 w-5 rounded-lg" />
                      Etherscan
                      {/* <HiOutlineExternalLink className="text-md" /> */}
                    </span>
                  </AOutlineButton>
                ) : (
                  <ATextButton
                    className="px-1"
                    onClick={() => window.open(getChainScannerBase(chainId) + '/address/' + addressFromPath)}
                  >
                    <HiOutlineExternalLink className="text-2xl" />
                  </ATextButton>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      <ToggleTab
        options={tabs as unknown as string[]}
        defaultOption={tabs[0]}
        onChange={setSelectedProfileTab as unknown as (selection: string) => void}
        border={true}
      />
      {/* <div className="mt-6 flex space-x-5 text-sm">
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
      </div> */}
    </div>
  );
};
