export const infinityStakerAbi = [
  {
    inputs: [
      { internalType: 'address', name: '_tokenAddress', type: 'address' },
      { internalType: 'address', name: '_infinityTreasury', type: 'address' }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'enum Duration', name: 'oldDuration', type: 'uint8' },
      { indexed: false, internalType: 'enum Duration', name: 'newDuration', type: 'uint8' }
    ],
    name: 'DurationChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'address', name: 'account', type: 'address' }],
    name: 'Paused',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'totalToUser', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'penalty', type: 'uint256' }
    ],
    name: 'RageQuit',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'enum Duration', name: 'duration', type: 'uint8' }
    ],
    name: 'Staked',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'UnStaked',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'address', name: 'account', type: 'address' }],
    name: 'Unpaused',
    type: 'event'
  },
  { stateMutability: 'payable', type: 'fallback' },
  {
    inputs: [],
    name: 'BRONZE_STAKE_THRESHOLD',
    outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'GOLD_STAKE_THRESHOLD',
    outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'INFINITY_REWARDS_CONTRACT',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'INFINITY_TOKEN',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'INFINITY_TREASURY',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'PLATINUM_STAKE_THRESHOLD',
    outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'SILVER_STAKE_THRESHOLD',
    outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'SIX_MONTH_PENALTY',
    outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'THREE_MONTH_PENALTY',
    outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'TWELVE_MONTH_PENALTY',
    outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'enum Duration', name: 'oldDuration', type: 'uint8' },
      { internalType: 'enum Duration', name: 'newDuration', type: 'uint8' }
    ],
    name: 'changeDuration',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getRageQuitAmounts',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getUserStakeLevel',
    outputs: [{ internalType: 'enum StakeLevel', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getUserStakePower',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getUserTotalStaked',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getUserTotalVested',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getVestingInfo',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'uint256', name: 'timestamp', type: 'uint256' }
        ],
        internalType: 'struct InfinityStaker.StakeAmount[]',
        name: '',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  { inputs: [], name: 'rageQuit', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [{ internalType: 'address', name: 'destination', type: 'address' }],
    name: 'rescueETH',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'destination', type: 'address' },
      { internalType: 'address', name: 'currency', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'rescueTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'enum Duration', name: 'duration', type: 'uint8' }
    ],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'unstake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '_infinityRewardsContract', type: 'address' }],
    name: 'updateInfinityRewardsContract',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '_infinityTreasury', type: 'address' }],
    name: 'updateInfinityTreasury',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'threeMonthPenalty', type: 'uint16' },
      { internalType: 'uint16', name: 'sixMonthPenalty', type: 'uint16' },
      { internalType: 'uint16', name: 'twelveMonthPenalty', type: 'uint16' }
    ],
    name: 'updatePenalties',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'enum StakeLevel', name: 'stakeLevel', type: 'uint8' },
      { internalType: 'uint16', name: 'threshold', type: 'uint16' }
    ],
    name: 'updateStakeLevelThreshold',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'enum Duration', name: '', type: 'uint8' }
    ],
    name: 'userstakedAmounts',
    outputs: [
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'timestamp', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  { stateMutability: 'payable', type: 'receive' }
];
