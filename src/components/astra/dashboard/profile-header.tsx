import { NextRouter, useRouter } from 'next/router';
import { EZImage, NextLink } from 'src/components/common';
import person from 'src/images/person.png';
import { ellipsisAddress } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { cardClr, inputBorderColor, primaryBorderColor, primaryTextColor, textClr } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface Props {
  expanded: boolean;
}

export const ProfileHeader = ({ expanded }: Props) => {
  const router = useRouter();
  const addressFromPath = router.query?.address as string;
  return (
    <div
      className={twMerge(inputBorderColor, cardClr, textClr, 'flex-col items-center rounded-tl-lg border-b px-8 pt-5')}
    >
      {expanded && (
        <>
          <div className="flex flex-col items-start">
            <div className="flex w-full items-center">
              <EZImage src={person.src} className="mr-6 h-14 w-14 rounded-full overflow-clip" />
              <div className="flex w-full items-center">
                <div className="tracking-tight font-bold text-2xl">{ellipsisAddress(addressFromPath)}</div>
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

export class RouteUtils {
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

export const ProfileHeaderTabBar = () => {
  const router = useRouter();
  const tabItems = RouteUtils.tabItems(router);
  const addressFromPath = router.query?.address as string;

  return (
    <div className="mt-6 flex space-x-6">
      {tabItems.map((e) => {
        return (
          <div key={e.path} className={twMerge('pb-3', e.selected ? `border-b-4 ${primaryBorderColor}` : '')}>
            <NextLink href={`/v3/profile/${addressFromPath}/${e.path}`}>
              <div className={e.selected ? primaryTextColor : ''}>{e.name}</div>
            </NextLink>
          </div>
        );
      })}
    </div>
  );
};
