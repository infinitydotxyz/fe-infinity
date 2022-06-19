export const infinityTokenAbi = [
  {
    inputs: [
      { internalType: 'address', name: 'admin', type: 'address' },
      { internalType: 'uint256', name: 'epochInflation', type: 'uint256' },
      { internalType: 'uint256', name: 'epochDuration', type: 'uint256' },
      { internalType: 'uint256', name: 'epochCliff', type: 'uint256' },
      { internalType: 'uint256', name: 'maxEpochs', type: 'uint256' },
      { internalType: 'uint256', name: 'timelock', type: 'uint256' },
      { internalType: 'uint256', name: 'supply', type: 'uint256' }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'bytes32', name: 'configId', type: 'bytes32' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' }
    ],
    name: 'ChangeCanceled',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'bytes32', name: 'configId', type: 'bytes32' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' }
    ],
    name: 'ChangeConfirmed',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'bytes32', name: 'configId', type: 'bytes32' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' }
    ],
    name: 'ChangeRequested',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'delegator', type: 'address' },
      { indexed: true, internalType: 'address', name: 'fromDelegate', type: 'address' },
      { indexed: true, internalType: 'address', name: 'toDelegate', type: 'address' }
    ],
    name: 'DelegateChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'delegate', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'previousBalance', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'newBalance', type: 'uint256' }
    ],
    name: 'DelegateVotesChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'currentEpoch', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'supplyMinted', type: 'uint256' }
    ],
    name: 'EpochAdvanced',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'Snapshot',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' }
    ],
    name: 'Transfer',
    type: 'event'
  },
  {
    inputs: [],
    name: 'ADMIN',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'EPOCH_CLIFF',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'EPOCH_DURATION',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'EPOCH_INFLATION',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'MAX_EPOCHS',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'TIMELOCK',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function'
  },
  { inputs: [], name: 'advanceEpoch', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'uint256', name: 'snapshotId', type: 'uint256' }
    ],
    name: 'balanceOfAt',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'burnFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'string', name: 'name', type: 'string' }],
    name: 'calculateConfigId',
    outputs: [{ internalType: 'bytes32', name: 'configId', type: 'bytes32' }],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'configId', type: 'bytes32' }],
    name: 'cancelChange',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'uint32', name: 'pos', type: 'uint32' }
    ],
    name: 'checkpoints',
    outputs: [
      {
        components: [
          { internalType: 'uint32', name: 'fromBlock', type: 'uint32' },
          { internalType: 'uint224', name: 'votes', type: 'uint224' }
        ],
        internalType: 'struct ERC20Votes.Checkpoint',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'configId', type: 'bytes32' }],
    name: 'confirmChange',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'currentEpoch',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'currentEpochTimestamp',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' }
    ],
    name: 'decreaseAllowance',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'delegatee', type: 'address' }],
    name: 'delegate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'delegatee', type: 'address' },
      { internalType: 'uint256', name: 'nonce', type: 'uint256' },
      { internalType: 'uint256', name: 'expiry', type: 'uint256' },
      { internalType: 'uint8', name: 'v', type: 'uint8' },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 's', type: 'bytes32' }
    ],
    name: 'delegateBySig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'delegates',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getAdmin',
    outputs: [{ internalType: 'address', name: 'admin', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getCliff',
    outputs: [{ internalType: 'uint256', name: 'cliff', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'configId', type: 'bytes32' }],
    name: 'getConfig',
    outputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'id', type: 'bytes32' },
          { internalType: 'uint256', name: 'value', type: 'uint256' }
        ],
        internalType: 'struct TimelockConfig.Config',
        name: 'config',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'index', type: 'uint256' }],
    name: 'getConfigByIndex',
    outputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'id', type: 'bytes32' },
          { internalType: 'uint256', name: 'value', type: 'uint256' }
        ],
        internalType: 'struct TimelockConfig.Config',
        name: 'config',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getConfigCount',
    outputs: [{ internalType: 'uint256', name: 'count', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getEpochDuration',
    outputs: [{ internalType: 'uint256', name: 'epochDuration', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getInflation',
    outputs: [{ internalType: 'uint256', name: 'inflation', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getMaxEpochs',
    outputs: [{ internalType: 'uint256', name: 'totalEpochs', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'blockNumber', type: 'uint256' }],
    name: 'getPastTotalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'uint256', name: 'blockNumber', type: 'uint256' }
    ],
    name: 'getPastVotes',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'configId', type: 'bytes32' }],
    name: 'getPending',
    outputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'id', type: 'bytes32' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'uint256', name: 'timestamp', type: 'uint256' }
        ],
        internalType: 'struct TimelockConfig.PendingChange',
        name: 'pendingRequest',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'index', type: 'uint256' }],
    name: 'getPendingByIndex',
    outputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'id', type: 'bytes32' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'uint256', name: 'timestamp', type: 'uint256' }
        ],
        internalType: 'struct TimelockConfig.PendingChange',
        name: 'pendingRequest',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getPendingCount',
    outputs: [{ internalType: 'uint256', name: 'count', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getTimelock',
    outputs: [{ internalType: 'uint256', name: 'timelock', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'getVotes',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'addedValue', type: 'uint256' }
    ],
    name: 'increaseAllowance',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'configId', type: 'bytes32' }],
    name: 'isConfig',
    outputs: [{ internalType: 'bool', name: 'status', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'configId', type: 'bytes32' }],
    name: 'isPending',
    outputs: [{ internalType: 'bool', name: 'status', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'nonces',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'numCheckpoints',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
      { internalType: 'uint8', name: 'v', type: 'uint8' },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 's', type: 'bytes32' }
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'previousEpochTimestamp',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'configId', type: 'bytes32' },
      { internalType: 'uint256', name: 'value', type: 'uint256' }
    ],
    name: 'requestChange',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'snapshotId', type: 'uint256' }],
    name: 'totalSupplyAt',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
