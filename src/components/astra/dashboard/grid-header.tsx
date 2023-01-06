import { NextRouter, useRouter } from 'next/router';
import { BlueCheck, EZImage, NextLink, ReadMoreText, Spacer } from 'src/components/common';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { cardColor, inputBorderColor, primaryBorderColor, primaryTextColor, textColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

export interface GridHeaderProps {
  expanded: boolean;
  avatarUrl: string;
  title: string;
  slug: string;
  description?: string;
  hasBlueCheck?: boolean;
  children?: React.ReactNode;
}
export const GridHeader = ({ expanded, avatarUrl, title, description, hasBlueCheck, children }: GridHeaderProps) => {
  return (
    <div
      className={twMerge(
        inputBorderColor,
        cardColor,
        textColor,
        'flex-col items-center rounded-tl-lg border-b px-8 pt-1'
      )}
    >
      {expanded && (
        <>
          <div className="flex flex-col items-start">
            <div className="flex w-full items-center">
              <EZImage src={avatarUrl} className="mr-6 h-16 w-16 rounded-xl" />
              <div className="flex w-full items-center">
                <div className="tracking-tight font-bold text-2xl">{title}</div>
                {hasBlueCheck ? <BlueCheck className="ml-2" /> : null}
              </div>
            </div>

            {description && (
              <div className="max-w-5xl">
                <ReadMoreText text={description} min={50} ideal={160} max={1000} />
              </div>
            )}
          </div>
          {children && (
            <>
              <Spacer />
              {children}
            </>
          )}
        </>
      )}

      <HeaderTabBar />
    </div>
  );
};

// ==============================================

export class RouteUtils {
  static tabItems = (router: NextRouter) => {
    const path = router.pathname;

    return [
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
      },
      {
        id: 'analytics',
        path: 'analytics',
        selected: path.endsWith('analytics'),
        name: 'Analytics'
      }
    ];
  };
}

export const HeaderTabBar = () => {
  const { collection } = useDashboardContext();
  const router = useRouter();

  const tabItems = RouteUtils.tabItems(router);

  return (
    <div className="flex space-x-6">
      {tabItems.map((e) => {
        return (
          <div key={e.path} className={twMerge('pb-3', e.selected ? `border-b-4 ${primaryBorderColor}` : '')}>
            <NextLink href={`/collection/${collection?.slug}/${e.path}`}>
              <div className={e.selected ? primaryTextColor : ''}>{e.name}</div>
            </NextLink>
          </div>
        );
      })}
    </div>
  );
};
