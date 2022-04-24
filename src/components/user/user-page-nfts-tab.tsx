import { FunctionComponent, useEffect, useState } from 'react';
import { apiGet } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';

export const UserPageNftsTab: FunctionComponent = () => {
  const { user } = useAppContext();
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const { result } = await apiGet(`/user/${user?.address}/nfts?chainId=1&limit=50`, {
      query: {
        limit: 50
      }
    });
    setData(result.data);
    console.log('result', result);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-xl">Collected NFTs: {data?.length}</h2>
    </div>
  );
};
