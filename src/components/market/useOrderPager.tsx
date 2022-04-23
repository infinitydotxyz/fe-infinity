import { OBOrder } from '@infinityxyz/lib/types/core';
import { useEffect, useState } from 'react';
import { apiPost } from 'src/utils';

export function useOrderPager() {
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

  const emptyResponse = () => {
    return {
      buyOrders: { cursor: '', orders: [] },
      sellOrders: { cursor: '', orders: [] },
      error: '',
      success: '',
      matches: []
    };
  };

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

      const body = {};
      const { result, error } = await apiPost('/orders/get', { data: body });

      if (error !== undefined) {
        console.log(error);
        return emptyResponse();
      }

      setOrders(result.orders);
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
}
