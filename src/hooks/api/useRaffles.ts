import {
  ChainId,
  RaffleRewardsDoc,
  RaffleState,
  RaffleTicketTotalsDoc,
  UserRaffle
} from '@infinityxyz/lib-frontend/types/core';
import { useFetch } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

const stateOrder = {
  [RaffleState.Unstarted]: 4,
  [RaffleState.InProgress]: 2,
  [RaffleState.Locked]: 1,
  [RaffleState.Finalized]: 0,
  [RaffleState.Completed]: 3
};

export type Raffle = UserRaffle & { progress: number } & {
  totals: Pick<RaffleTicketTotalsDoc, 'totalNumTickets' | 'numUniqueEntrants'> & Pick<RaffleRewardsDoc, 'prizePoolEth'>;
};

const res: Raffle[] = [
  {
    name: 'Phase 1 Raffle',
    activePhaseIds: ['1'],
    state: 'IN_PROGRESS',
    raffleContractAddress: '',
    config: {
      listing: { maxPercentAboveFloor: 5, minTimeValid: 604800000, ticketMultiplier: 100 },
      offer: { ticketMultiplier: 500, maxPercentBelowFloor: 0, minTimeValid: 604800000 },
      volume: { ticketRateNumerator: 1, ticketRateDenominator: 1 }
    },
    id: '1',
    type: 'USER',
    stakerContractAddress: '0xbff1b5b3b9775b6a775fdc1e688d0f365b49648a',
    raffleContractChainId: '1',
    activePhases: [{ name: 'Phase 1', index: 0, id: '1' }],
    stakerContractChainId: '1',
    chainId: '1',
    updatedAt: 1664486702565,
    progress: 0.000012,
    totals: {
      totalNumTickets: BigInt(30_000),
      numUniqueEntrants: 1542,
      prizePoolEth: 0.0271470375
    }
  } as Raffle,
  {
    activePhaseIds: ['2'],
    stakerContractChainId: '1',
    updatedAt: 1664486702565,
    stakerContractAddress: '0xbff1b5b3b9775b6a775fdc1e688d0f365b49648a',
    type: 'USER',
    raffleContractAddress: '',
    chainId: '1',
    state: 'UNSTARTED',
    raffleContractChainId: '1',
    name: 'Phase 2 Raffle',
    config: {
      offer: { ticketMultiplier: 500, maxPercentBelowFloor: 0, minTimeValid: 604800000 },
      listing: { maxPercentAboveFloor: 5, ticketMultiplier: 100, minTimeValid: 604800000 },
      volume: { ticketRateDenominator: 1, ticketRateNumerator: 1 }
    },
    activePhases: [{ id: '2', name: 'Phase 2', index: 1 }],
    id: '2',
    progress: 0,
    totals: {
      totalNumTickets: BigInt(0),
      numUniqueEntrants: 0,
      prizePoolEth: 0
    }
  } as Raffle,
  {
    activePhases: [{ index: 2, name: 'Phase 3', id: '3' }],
    config: {
      volume: { ticketRateNumerator: 1, ticketRateDenominator: 1 },
      offer: { ticketMultiplier: 500, minTimeValid: 604800000, maxPercentBelowFloor: 0 },
      listing: { ticketMultiplier: 100, minTimeValid: 604800000, maxPercentAboveFloor: 5 }
    },
    updatedAt: 1664486702565,
    chainId: '1',
    state: 'UNSTARTED',
    stakerContractChainId: '1',
    activePhaseIds: ['3'],
    stakerContractAddress: '0xbff1b5b3b9775b6a775fdc1e688d0f365b49648a',
    raffleContractChainId: '1',
    id: '3',
    name: 'Phase 3 Raffle',
    type: 'USER',
    raffleContractAddress: '',
    progress: 0,
    totals: {
      totalNumTickets: BigInt(0),
      numUniqueEntrants: 0,
      prizePoolEth: 0
    }
  } as Raffle,
  {
    type: 'USER',
    activePhases: [{ index: 3, id: '4', name: 'Phase 4' }],
    config: {
      listing: { maxPercentAboveFloor: 5, minTimeValid: 604800000, ticketMultiplier: 100 },
      offer: { maxPercentBelowFloor: 0, minTimeValid: 604800000, ticketMultiplier: 500 },
      volume: { ticketRateNumerator: 1, ticketRateDenominator: 1 }
    },
    activePhaseIds: ['4'],
    stakerContractChainId: '1',
    id: '4',
    updatedAt: 1664486702565,
    stakerContractAddress: '0xbff1b5b3b9775b6a775fdc1e688d0f365b49648a',
    name: 'Phase 4 Raffle',
    state: 'UNSTARTED',
    chainId: '1',
    raffleContractChainId: '1',
    raffleContractAddress: '',
    progress: 0,
    totals: {
      totalNumTickets: BigInt(0),
      numUniqueEntrants: 0,
      prizePoolEth: 0
    }
  } as Raffle,
  {
    stakerContractChainId: '1',
    raffleContractAddress: '',
    updatedAt: 1664486702565,
    raffleContractChainId: '1',
    chainId: '1',
    type: 'USER',
    config: {
      listing: { minTimeValid: 604800000, maxPercentAboveFloor: 5, ticketMultiplier: 100 },
      volume: { ticketRateNumerator: 1, ticketRateDenominator: 1 },
      offer: { minTimeValid: 604800000, ticketMultiplier: 500, maxPercentBelowFloor: 0 }
    },
    state: 'IN_PROGRESS',
    id: 'grandPrize',
    activePhaseIds: ['1', '2', '3', '4'],
    name: 'Grand Prize Raffle',
    stakerContractAddress: '0xbff1b5b3b9775b6a775fdc1e688d0f365b49648a',
    activePhases: [
      { name: 'Phase 1', id: '1', index: 0 },
      { index: 1, name: 'Phase 2', id: '2' },
      { id: '3', index: 2, name: 'Phase 3' },
      { index: 3, name: 'Phase 4', id: '4' }
    ],
    progress: 0.000003,
    totals: {
      totalNumTickets: BigInt(35_234),
      numUniqueEntrants: 1237,
      prizePoolEth: 0.0271470375
    }
  } as Raffle
];

export const useRaffles = () => {
  const { chainId } = useOnboardContext();

  const query = {
    chainId: (chainId || ChainId.Mainnet) as ChainId,
    states: ['active', 'inactive', 'complete']
  };

  //   const { result, isLoading, isError, mutate, error } = useFetch<(StakingContractRaffle & { progress: number })[]>(
  //     '/raffles',
  //     { query }
  //   );

  return {
    result: (res ?? []).sort((a, b) => stateOrder[a.state] - stateOrder[b.state]),
    isLoading: false,
    isError: false,
    error: null
  };
};
