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

  const fetchOwnedColls = async () => {
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
    fetchOwnedColls();
  }, []);

  return (
    <div className={twMerge('border rounded-lg p-2 overflow-y-scroll scrollbar-hide text-sm w-full', borderColor)}>
      <div className={twMerge('p-3 text-lg font-medium')}>Owned Collections</div>
      <div className={twMerge('mx-3 border-b-[1px] mb-1', borderColor)}></div>
      {ownedColls.map((item) => {
        return (
          <div key={item.address} className="flex">
            <div
              className={twMerge(
                'flex space-x-3 items-center cursor-pointer w-full p-3 rounded-lg',
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
              <EZImage src={item.imageUrl} className="w-9 h-9 rounded" />
              <div className="space-y-1">
                <div>{item.name}</div>
                <div className={twMerge('text-xs', secondaryTextColor)}>
                  Floor: {item.floorPrice} {EthSymbol}
                </div>
              </div>
              <Spacer />
              <span className={twMerge('text-xs', secondaryTextColor)}>{item.numNFTs}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
