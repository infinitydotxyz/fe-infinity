import { NextRouter, useRouter } from 'next/router';
import { BlueCheck, ClipboardButton, EZImage, NextLink, ReadMoreText, Spacer } from 'src/components/common';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import {
  cardColor,
  inputBorderColor,
  primaryBorderColor,
  primaryTextColor,
  smallIconButtonStyle,
  textColor
} from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

export interface GridHeaderProps {
  expanded: boolean;
  avatarUrl: string;
  title: string;
  slug: string;
  description?: string;
  hasBlueCheck?: boolean;
  children?: React.ReactNode;
  collectionAddress?: string;
}

export const GridHeader = ({
  expanded,
  avatarUrl,
  title,
  description,
  collectionAddress,
  hasBlueCheck,
  children
}: GridHeaderProps) => {
  return (
    <div className={twMerge(inputBorderColor, cardColor, textColor, 'border-b px-8')}>
      {expanded && (
        <>
          <div className="flex flex-col space-y-3">
            <div className="flex w-full items-center">
              <EZImage src={avatarUrl} className="mr-4 h-14 w-14 rounded-xl" />
              <div className="flex w-full items-center space-x-2">
                <div className="font-bold text-xl">{title}</div>
                {hasBlueCheck ? <BlueCheck /> : null}
                <ClipboardButton
                  textToCopy={collectionAddress ?? ''}
                  className={twMerge('cursor-pointer', smallIconButtonStyle)}
                />
              </div>
            </div>

            {description && (
              <div className="max-w-5xl text-sm">
                <ReadMoreText text={description} min={30} ideal={60} max={100} />
              </div>
            )}
          </div>
        </>
      )}

      <HeaderTabBar children={children} />
    </div>
  );
};

interface Props2 {
  children?: React.ReactNode;
}

const HeaderTabBar = ({ children }: Props2) => {
  const { collection } = useDashboardContext();
  const router = useRouter();

  const tabItems = RouteUtils.tabItems(router);

  return (
    <div className="flex mt-4 text-sm">
      <div className="flex space-x-8">
        {tabItems.map((e) => {
          return (
            <div key={e.path} className={twMerge('pb-2', e.selected ? `border-b-2 ${primaryBorderColor}` : '')}>
              <NextLink href={`/collection/${collection?.slug}/${e.path}`}>
                <div className={e.selected ? primaryTextColor : ''}>{e.name}</div>
              </NextLink>
            </div>
          );
        })}
      </div>
      {children && (
        <>
          <Spacer />
          {children}
        </>
      )}
    </div>
  );
};
class RouteUtils {
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
