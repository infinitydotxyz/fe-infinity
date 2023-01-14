import { NextRouter, useRouter } from 'next/router';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { ClipboardButton, EZImage, NextLink } from 'src/components/common';
import etherscanLogo from 'src/images/etherscan-logo.png';
import person from 'src/images/person.png';
import { ellipsisAddress, getChainScannerBase } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import {
  borderColor,
  brandBorderColor,
  cardColor,
  hoverColor,
  hoverColorBrandText,
  secondaryTextColor,
  smallIconButtonStyle,
  textColor
} from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { AOutlineButton } from '../astra-button';

interface Props {
  expanded: boolean;
}

export const ProfileHeader = ({ expanded }: Props) => {
  const router = useRouter();
  const addressFromPath = router.query?.address as string;
  const { chainId } = useOnboardContext();

  return (
    <div className={twMerge(borderColor, cardColor, textColor, 'px-6 pt-4')}>
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

      <ProfileHeaderTabBar />
    </div>
  );

  return <></>;
};

// ==============================================

export const ProfileHeaderTabBar = () => {
  const router = useRouter();
  const tabItems = RouteUtils.tabItems(router);
  const addressFromPath = router.query?.address as string;

  return (
    <div className="mt-6 flex space-x-5 text-sm">
      {tabItems.map((e) => {
        return (
          <div key={e.path} className={twMerge('pb-2 px-3', e.selected ? `border-b-2 ${brandBorderColor}` : '')}>
            <NextLink href={`/profile/${addressFromPath}/${e.path}`}>
              <div className={twMerge(e.selected ? textColor : secondaryTextColor, hoverColorBrandText, 'font-medium')}>
                {e.name}
              </div>
            </NextLink>
          </div>
        );
      })}
    </div>
  );
};

class RouteUtils {
  static tabItems = (router: NextRouter) => {
    const path = router.pathname;
    const addressFromPath = router.query?.address;
    const { user } = useOnboardContext();
    const isOwner = addressFromPath === user?.address;

    const returnData = [
      {
        id: 'items',
        path: 'items',
        selected: path.endsWith('items'),
        name: 'Items'
      },
      {
        id: 'orders',
        path: 'orders',
        selected: path.endsWith('orders'),
        name: 'Orders'
      },
      {
        id: 'activity',
        path: 'activity',
        selected: path.endsWith('activity'),
        name: 'Activity'
      }
    ];

    if (isOwner) {
      returnData.push({
        id: 'send',
        path: 'send',
        selected: path.endsWith('send'),
        name: 'Send'
      });
    }

    return returnData;
  };
}
