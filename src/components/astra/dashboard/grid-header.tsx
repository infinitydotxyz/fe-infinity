import { cardClr, inputBorderColor, textClr, primaryBorderColor, primaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { BlueCheck, EZImage, NextLink, ReadMoreText, Spacer } from 'src/components/common';
import { NextRouter, useRouter } from 'next/router';
import { AListGridButton } from '../astra-button';

interface Props {
  expanded: boolean;
}
export const GridHeader = ({ expanded }: Props) => {
  const { numTokens, collection } = useDashboardContext();

  const avatarUrl = collection?.bannerImage || collection?.profileImage;
  const name = collection?.name ?? '';
  const description = collection?.description ?? '';

  if (collection) {
    return (
      <div
        className={twMerge(
          inputBorderColor,
          cardClr,
          textClr,
          'flex-col items-center rounded-tl-lg border-b px-8 pt-5'
        )}
      >
        {expanded && (
          <>
            <div className="flex flex-col items-start">
              <div className="flex w-full items-start">
                <EZImage src={avatarUrl} className="mr-6 h-20 w-20 rounded-xl" />

                <div className="flex w-full items-center">
                  <div className="tracking-tight font-bold text-4xl  ">{name}</div>

                  {collection.hasBlueCheck ? <BlueCheck className="ml-2" /> : null}
                </div>
              </div>

              <div className="max-w-3xl">
                <ReadMoreText text={description} min={50} ideal={160} max={10000} />
              </div>
            </div>
            <Spacer />
            <div className="flex flex-col items-end">
              <div className="text-lg whitespace-nowrap ml-3">{numTokens} Nfts</div>
            </div>
          </>
        )}

        <HeaderTabBar />

        <div className={twMerge(inputBorderColor, 'w-full flex   py-2 border-t-[1px]')}>
          <Spacer />
          <AListGridButton />
        </div>
      </div>
    );
  }

  return <></>;
};

// ==============================================

export class RouteUtils {
  static currentPath = (router: NextRouter) => {
    let result = router.asPath;

    if (result === '/new') {
      result = '/new/items';
    }

    return result;
  };

  static tabItems = (router: NextRouter) => {
    const path = RouteUtils.currentPath(router);

    return [
      {
        id: 'items',
        path: '/new/items',
        selected: '/new/items' === path,
        name: 'Items'
      },
      {
        id: 'orders',
        path: '/new/orders',
        selected: '/new/orders' === path,
        name: 'Orders'
      },
      {
        id: 'activity',
        path: '/new/activity',
        selected: '/new/activity' === path,
        name: 'Activity'
      },
      {
        id: 'analytics',
        path: '/new/analytics',
        selected: '/new/analytics' === path,
        name: 'Analytics'
      }
    ];
  };
}

export const HeaderTabBar = () => {
  const router = useRouter();

  const tabItems = RouteUtils.tabItems(router);

  return (
    <div className="flex space-x-6">
      {tabItems.map((e) => {
        return (
          <div key={e.path} className={twMerge('pb-3', e.selected ? `border-b-4 ${primaryBorderColor}` : '')}>
            <NextLink href={e.path}>
              <div className={e.selected ? primaryTextColor : ''}>{e.name}</div>
            </NextLink>
          </div>
        );
      })}
    </div>
  );
};
