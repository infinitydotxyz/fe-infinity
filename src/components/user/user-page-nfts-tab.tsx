import { FunctionComponent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { apiGet } from 'src/utils';
import { GalleryBox } from '../gallery/gallery-box';
import { useAppContext } from 'src/utils/context/AppContext';

export const UserPageNftsTab: FunctionComponent = () => {
  const router = useRouter();
  const { user } = useAppContext();
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const { result } = await apiGet(`/user/${user?.address}/nfts?chainId=1&limit=50`, {
      query: {
        limit: 50
      }
    });
    setData(result?.data);
    console.log('result', result);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-xl">Collected NFTs: {data?.length}</h2>

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
