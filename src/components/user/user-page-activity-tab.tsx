import { FunctionComponent, useEffect, useState } from 'react';
import { apiGet } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';

export const UserPageActivityTab: FunctionComponent = () => {
  const { user } = useAppContext();
  const [data, setData] = useState([]);

  // TODO: replace with endpoint to fetch User's Activities (sells, transfers, etc.)
  const fetchData = async () => {
    const { result } = await apiGet(`/user/${user?.address}/nfts?chainId=1&limit=50`, {
      query: {
        limit: 50
      }
    });
    setData(result?.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-xl">Activity: {data?.length}</h2>
    </div>
  );
};
