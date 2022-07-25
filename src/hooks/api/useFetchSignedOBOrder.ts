import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { useState } from 'react';
import { toastError } from 'src/components/common';
import { fetchUserSignedOBOrder } from 'src/utils/orderbookUtils';

export const useFetchSignedOBOrder = () => {
  const [signedOBOrder, setSignedOBOrder] = useState<SignedOBOrder | null>(null);

  const fetchSignedOBOrder = async (orderId: string) => {
    try {
      const signedOBOrder = await fetchUserSignedOBOrder(orderId);
      setSignedOBOrder(signedOBOrder);
      return signedOBOrder;
    } catch (err) {
      toastError('Failed to fetch signed order');
    }
  };
  return { signedOBOrder, setSignedOBOrder, fetchSignedOBOrder };
};
