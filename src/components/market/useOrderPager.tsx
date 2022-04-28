import { OBOrder } from '@infinityxyz/lib/types/core';
import { useEffect, useState } from 'react';
import { getOrders } from 'src/utils/marketUtils';

export const useOrderPager = () => {
  const [orders, setOrders] = useState<OBOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // let isActive = true;

    // fetchData(false);
    fetchOrders(false);

    return () => {
      // isActive = false;
    };
  }, []);

  const fetchMore = async () => {
    // if (!hasMore()) {
    //   return;
    // }

    return fetchOrders(true);
  };

  // todo: make this prod ready
  const fetchOrders = async (fetchMore: boolean) => {
    console.log(fetchMore);
    try {
      setIsLoading(true);
      const orders = await getOrders();
      setOrders(orders);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    orders,
    isLoading,
    fetchMore
  };
};
