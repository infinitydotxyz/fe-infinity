import { UserCollection, UserCollectionsResponse } from '@infinityxyz/lib-frontend/types/dto';
import { useEffect, useState } from 'react';
import { apiGet } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { borderColor, hoverColor, hoverColorBrandText, secondaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { useNetwork } from 'wagmi';
import { EZImage, EthSymbol, Spacer } from '../common';
import { useProfileContext } from 'src/utils/context/ProfileContext';

interface Props {
  userAddress: string;
}

export const ProfileCollections = ({ userAddress }: Props) => {
  const { chain } = useNetwork();
  const { selectedChain } = useAppContext();
  const chainId = String(chain?.id ?? selectedChain);

  const [ownedColls, setOwnedColls] = useState<UserCollection[]>([]);

  const { selectedCollection, setSelectedCollection } = useProfileContext();

  const fetchOwnedColls = async (chainId: string, userAddress: string) => {
    const { result, error } = await apiGet(`/user/${userAddress}/collections`, {
      query: { chainId, hideSpam: true }
    });

    if (error) {
      console.error(error);
      return;
    }

    const response = result as UserCollectionsResponse;
    setOwnedColls(response.data);
  };

  useEffect(() => {
    fetchOwnedColls(chainId, userAddress);
  }, [userAddress, chainId]);

  return (
    <div className={twMerge('rounded-lg overflow-y-scroll scrollbar-hide text-sm w-full', borderColor)}>
      <div className="py-5 !text-22 text-lg font-semibold lg:leading-9 px-5 lg:px-0 text-neutral-700 dark:text-white">
        Owned Collections
      </div>
      <div className="flex flex-col sm:px-5 lg:px-0">
        {ownedColls.map((item) => {
          return (
            <div
              key={item.address}
              className={twMerge(
                'flex space-x-5 items-center cursor-pointer w-full first:rounded-t-10 first:pt-3.75 last:rounded-b-10 px-3.75 py-2.5 bg-zinc-300 dark:bg-neutral-800',
                hoverColorBrandText,
                hoverColor
              )}
              onClick={() => {
                if (selectedCollection?.address === item.address) {
                  setSelectedCollection(undefined);
                  return;
                }
                setSelectedCollection({ address: item.address, name: item.name, imageUrl: item.imageUrl });
              }}
            >
              <EZImage src={item.imageUrl} className="w-20 h-20 rounded" />
              <div className="">
                <div className={twMerge('!text-xl leading-7 font-bold', secondaryTextColor)}>{item.name}</div>
                <div className={twMerge('text-base leading-6 font-semibold', secondaryTextColor)}>
                  Floor{' '}
                  <span className="text-17 text-amber-700 ml-1.25 font-normal">
                    <span className="font-supply">{item.floorPrice}</span>
                    {EthSymbol}
                  </span>
                </div>
              </div>
              <Spacer />
              <span className={twMerge('!text-22 font-bold px-2.5', secondaryTextColor)}>{item.numNFTs}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
