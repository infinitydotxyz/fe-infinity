import { NextRouter, useRouter } from 'next/router';
import { EZImage, NextLink } from 'src/components/common';
import person from 'src/images/person.png';
import { ellipsisAddress } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { cardColor, borderColor, brandBorderColor, textColor, secondaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface Props {
  expanded: boolean;
}

export const ProfileHeader = ({ expanded }: Props) => {
  const router = useRouter();
  const addressFromPath = router.query?.address as string;
  return (
    <div className={twMerge(borderColor, cardColor, textColor, 'px-6 pt-2')}>
      {expanded && (
        <>
          <div className="flex flex-col items-start">
            <div className="flex w-full items-center">
              <EZImage src={person.src} className="mr-4 h-14 w-14 rounded-full overflow-clip" />
              <div className="flex w-full items-center">
                <div className="font-heading font-bold text-xl">{ellipsisAddress(addressFromPath)}</div>
              </div>
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
    <div className="mt-4 flex space-x-5 text-sm">
      {tabItems.map((e) => {
        return (
          <div key={e.path} className={twMerge('pb-2 px-3', e.selected ? `border-b-2 ${brandBorderColor}` : '')}>
            <NextLink href={`/profile/${addressFromPath}/${e.path}`}>
              <div className={twMerge(e.selected ? textColor : secondaryTextColor, 'font-medium')}>{e.name}</div>
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
