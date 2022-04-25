import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';
import { GalleryBox } from '../gallery/gallery-box';
import { useAppContext } from 'src/utils/context/AppContext';

export const UserPageNftsTab: FunctionComponent = () => {
  const router = useRouter();
  const { user } = useAppContext();

  return (
    <div>
      <div className="mt-20">
        <GalleryBox
          getEndpoint={`/user/${user?.address}/nfts?chainId=1&limit=50`}
          collection={null}
          cardProps={{
            cardActions: [
              {
                label: 'Details',
                onClick: (ev, data) => {
                  router.push(`/asset/${data?.chainId}/${data?.tokenAddress}/${data?.tokenId}`);
                }
              }
            ]
          }}
        />
      </div>
    </div>
  );
};
