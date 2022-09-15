import { Phase } from '@infinityxyz/lib-frontend/types/core';
import { UserRaffleTicketsDto } from '@infinityxyz/lib-frontend/types/dto/raffle';
import { useFetch } from 'src/utils';

export const useUserRaffleTickets = (phase: Phase, user?: string) => {
  const res = useFetch<UserRaffleTicketsDto>(user ? `/raffle/${phase}/user/${user}` : null);

  return {
    res
  };
};
