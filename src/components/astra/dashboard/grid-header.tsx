import { inputBorderColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { BlueCheck, EZImage, NextLink, ReadMoreText, Spacer } from 'src/components/common';

export const GridHeader = () => {
  const { numTokens, collection } = useDashboardContext();

  const avatarUrl = collection?.bannerImage || collection?.profileImage;
  const name = collection?.name ?? '';
  const description = collection?.description ?? '';

  if (collection) {
    return (
      <div className={twMerge(inputBorderColor, 'flex-col items-center bg-gray-100 border-b px-8 py-3')}>
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

        <div className="flex  space-x-4">
          <NextLink href={'/new/items'}>
            <div>Items</div>
          </NextLink>
          <NextLink href={'/new/orders'}>
            <div>Orders</div>
          </NextLink>
          <NextLink href={'/new/items'}>
            <div>Activity</div>
          </NextLink>
          <NextLink href={'/new/orders'}>
            <div>Analytics</div>
          </NextLink>
        </div>
      </div>
    );
  }

  return <></>;
};
