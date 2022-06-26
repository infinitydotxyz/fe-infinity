export const InfinityExchangeABI = [
  {
    inputs: [
      { internalType: 'address', name: '_weth', type: 'address' },
      { internalType: 'address', name: '_matchExecutor', type: 'address' }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'newMinNonce', type: 'uint256' }
    ],
    name: 'CancelAllOrders',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint256[]', name: 'orderNonces', type: 'uint256[]' }
    ],
    name: 'CancelMultipleOrders',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'destination', type: 'address' },
      { indexed: true, internalType: 'address', name: 'currency', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'ERC20Withdrawn',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'destination', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'ETHWithdrawn',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'address', name: 'matchExecutor', type: 'address' }],
    name: 'MatchExecutorUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'bytes32', name: 'sellOrderHash', type: 'bytes32' },
      { indexed: false, internalType: 'bytes32', name: 'buyOrderHash', type: 'bytes32' },
      { indexed: true, internalType: 'address', name: 'seller', type: 'address' },
      { indexed: true, internalType: 'address', name: 'buyer', type: 'address' },
      { indexed: false, internalType: 'address', name: 'complication', type: 'address' },
      { indexed: true, internalType: 'address', name: 'currency', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'MatchOrderFulfilled',
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
    inputs: [{ indexed: false, internalType: 'uint32', name: 'protocolFee', type: 'uint32' }],
    name: 'ProtocolFeeUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'bytes32', name: 'orderHash', type: 'bytes32' },
      { indexed: true, internalType: 'address', name: 'seller', type: 'address' },
      { indexed: true, internalType: 'address', name: 'buyer', type: 'address' },
      { indexed: false, internalType: 'address', name: 'complication', type: 'address' },
      { indexed: true, internalType: 'address', name: 'currency', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'TakeOrderFulfilled',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'address', name: 'account', type: 'address' }],
    name: 'Unpaused',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'uint32', name: 'wethTransferGasUnits', type: 'uint32' }],
    name: 'WethTransferGasUnitsUpdated',
    type: 'event'
  },
  {
    inputs: [],
    name: 'MAX_PROTOCOL_FEE_BPS',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'MAX_WETH_TRANSFER_GAS_UNITS',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'WETH',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'minNonce', type: 'uint256' }],
    name: 'cancelAllOrders',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256[]', name: 'orderNonces', type: 'uint256[]' }],
    name: 'cancelMultipleOrders',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'uint256', name: 'nonce', type: 'uint256' }
    ],
    name: 'isNonceValid',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    name: 'isUserOrderNonceExecutedOrCancelled',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'matchExecutor',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'bool', name: 'isSellOrder', type: 'bool' },
          { internalType: 'address', name: 'signer', type: 'address' },
          { internalType: 'uint256[]', name: 'constraints', type: 'uint256[]' },
          {
            components: [
              { internalType: 'address', name: 'collection', type: 'address' },
              {
                components: [
                  { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
                  { internalType: 'uint256', name: 'numTokens', type: 'uint256' }
                ],
                internalType: 'struct OrderTypes.TokenInfo[]',
                name: 'tokens',
                type: 'tuple[]'
              }
            ],
            internalType: 'struct OrderTypes.OrderItem[]',
            name: 'nfts',
            type: 'tuple[]'
          },
          { internalType: 'address[]', name: 'execParams', type: 'address[]' },
          { internalType: 'bytes', name: 'extraParams', type: 'bytes' },
          { internalType: 'bytes', name: 'sig', type: 'bytes' }
        ],
        internalType: 'struct OrderTypes.MakerOrder',
        name: 'makerOrder',
        type: 'tuple'
      },
      {
        components: [
          { internalType: 'bool', name: 'isSellOrder', type: 'bool' },
          { internalType: 'address', name: 'signer', type: 'address' },
          { internalType: 'uint256[]', name: 'constraints', type: 'uint256[]' },
          {
            components: [
              { internalType: 'address', name: 'collection', type: 'address' },
              {
                components: [
                  { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
                  { internalType: 'uint256', name: 'numTokens', type: 'uint256' }
                ],
                internalType: 'struct OrderTypes.TokenInfo[]',
                name: 'tokens',
                type: 'tuple[]'
              }
            ],
            internalType: 'struct OrderTypes.OrderItem[]',
            name: 'nfts',
            type: 'tuple[]'
          },
          { internalType: 'address[]', name: 'execParams', type: 'address[]' },
          { internalType: 'bytes', name: 'extraParams', type: 'bytes' },
          { internalType: 'bytes', name: 'sig', type: 'bytes' }
        ],
        internalType: 'struct OrderTypes.MakerOrder[]',
        name: 'manyMakerOrders',
        type: 'tuple[]'
      }
    ],
    name: 'matchOneToManyOrders',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'bool', name: 'isSellOrder', type: 'bool' },
          { internalType: 'address', name: 'signer', type: 'address' },
          { internalType: 'uint256[]', name: 'constraints', type: 'uint256[]' },
          {
            components: [
              { internalType: 'address', name: 'collection', type: 'address' },
              {
                components: [
                  { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
                  { internalType: 'uint256', name: 'numTokens', type: 'uint256' }
                ],
                internalType: 'struct OrderTypes.TokenInfo[]',
                name: 'tokens',
                type: 'tuple[]'
              }
            ],
            internalType: 'struct OrderTypes.OrderItem[]',
            name: 'nfts',
            type: 'tuple[]'
          },
          { internalType: 'address[]', name: 'execParams', type: 'address[]' },
          { internalType: 'bytes', name: 'extraParams', type: 'bytes' },
          { internalType: 'bytes', name: 'sig', type: 'bytes' }
        ],
        internalType: 'struct OrderTypes.MakerOrder[]',
        name: 'makerOrders1',
        type: 'tuple[]'
      },
      {
        components: [
          { internalType: 'bool', name: 'isSellOrder', type: 'bool' },
          { internalType: 'address', name: 'signer', type: 'address' },
          { internalType: 'uint256[]', name: 'constraints', type: 'uint256[]' },
          {
            components: [
              { internalType: 'address', name: 'collection', type: 'address' },
              {
                components: [
                  { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
                  { internalType: 'uint256', name: 'numTokens', type: 'uint256' }
                ],
                internalType: 'struct OrderTypes.TokenInfo[]',
                name: 'tokens',
                type: 'tuple[]'
              }
            ],
            internalType: 'struct OrderTypes.OrderItem[]',
            name: 'nfts',
            type: 'tuple[]'
          },
          { internalType: 'address[]', name: 'execParams', type: 'address[]' },
          { internalType: 'bytes', name: 'extraParams', type: 'bytes' },
          { internalType: 'bytes', name: 'sig', type: 'bytes' }
        ],
        internalType: 'struct OrderTypes.MakerOrder[]',
        name: 'makerOrders2',
        type: 'tuple[]'
      }
    ],
    name: 'matchOneToOneOrders',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'bool', name: 'isSellOrder', type: 'bool' },
          { internalType: 'address', name: 'signer', type: 'address' },
          { internalType: 'uint256[]', name: 'constraints', type: 'uint256[]' },
          {
            components: [
              { internalType: 'address', name: 'collection', type: 'address' },
              {
                components: [
                  { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
                  { internalType: 'uint256', name: 'numTokens', type: 'uint256' }
                ],
                internalType: 'struct OrderTypes.TokenInfo[]',
                name: 'tokens',
                type: 'tuple[]'
              }
            ],
            internalType: 'struct OrderTypes.OrderItem[]',
            name: 'nfts',
            type: 'tuple[]'
          },
          { internalType: 'address[]', name: 'execParams', type: 'address[]' },
          { internalType: 'bytes', name: 'extraParams', type: 'bytes' },
          { internalType: 'bytes', name: 'sig', type: 'bytes' }
        ],
        internalType: 'struct OrderTypes.MakerOrder[]',
        name: 'sells',
        type: 'tuple[]'
      },
      {
        components: [
          { internalType: 'bool', name: 'isSellOrder', type: 'bool' },
          { internalType: 'address', name: 'signer', type: 'address' },
          { internalType: 'uint256[]', name: 'constraints', type: 'uint256[]' },
          {
            components: [
              { internalType: 'address', name: 'collection', type: 'address' },
              {
                components: [
                  { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
                  { internalType: 'uint256', name: 'numTokens', type: 'uint256' }
                ],
                internalType: 'struct OrderTypes.TokenInfo[]',
                name: 'tokens',
                type: 'tuple[]'
              }
            ],
            internalType: 'struct OrderTypes.OrderItem[]',
            name: 'nfts',
            type: 'tuple[]'
          },
          { internalType: 'address[]', name: 'execParams', type: 'address[]' },
          { internalType: 'bytes', name: 'extraParams', type: 'bytes' },
          { internalType: 'bytes', name: 'sig', type: 'bytes' }
        ],
        internalType: 'struct OrderTypes.MakerOrder[]',
        name: 'buys',
        type: 'tuple[]'
      },
      {
        components: [
          { internalType: 'address', name: 'collection', type: 'address' },
          {
            components: [
              { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
              { internalType: 'uint256', name: 'numTokens', type: 'uint256' }
            ],
            internalType: 'struct OrderTypes.TokenInfo[]',
            name: 'tokens',
            type: 'tuple[]'
          }
        ],
        internalType: 'struct OrderTypes.OrderItem[][]',
        name: 'constructs',
        type: 'tuple[][]'
      }
    ],
    name: 'matchOrders',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  { inputs: [], name: 'pause', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [],
    name: 'paused',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'protocolFeeBps',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function'
  },
  { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [
      {
        components: [
          { internalType: 'bool', name: 'isSellOrder', type: 'bool' },
          { internalType: 'address', name: 'signer', type: 'address' },
          { internalType: 'uint256[]', name: 'constraints', type: 'uint256[]' },
          {
            components: [
              { internalType: 'address', name: 'collection', type: 'address' },
              {
                components: [
                  { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
                  { internalType: 'uint256', name: 'numTokens', type: 'uint256' }
                ],
                internalType: 'struct OrderTypes.TokenInfo[]',
                name: 'tokens',
                type: 'tuple[]'
              }
            ],
            internalType: 'struct OrderTypes.OrderItem[]',
            name: 'nfts',
            type: 'tuple[]'
          },
          { internalType: 'address[]', name: 'execParams', type: 'address[]' },
          { internalType: 'bytes', name: 'extraParams', type: 'bytes' },
          { internalType: 'bytes', name: 'sig', type: 'bytes' }
        ],
        internalType: 'struct OrderTypes.MakerOrder[]',
        name: 'makerOrders',
        type: 'tuple[]'
      }
    ],
    name: 'takeMultipleOneOrders',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'bool', name: 'isSellOrder', type: 'bool' },
          { internalType: 'address', name: 'signer', type: 'address' },
          { internalType: 'uint256[]', name: 'constraints', type: 'uint256[]' },
          {
            components: [
              { internalType: 'address', name: 'collection', type: 'address' },
              {
                components: [
                  { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
                  { internalType: 'uint256', name: 'numTokens', type: 'uint256' }
                ],
                internalType: 'struct OrderTypes.TokenInfo[]',
                name: 'tokens',
                type: 'tuple[]'
              }
            ],
            internalType: 'struct OrderTypes.OrderItem[]',
            name: 'nfts',
            type: 'tuple[]'
          },
          { internalType: 'address[]', name: 'execParams', type: 'address[]' },
          { internalType: 'bytes', name: 'extraParams', type: 'bytes' },
          { internalType: 'bytes', name: 'sig', type: 'bytes' }
        ],
        internalType: 'struct OrderTypes.MakerOrder[]',
        name: 'makerOrders',
        type: 'tuple[]'
      },
      {
        components: [
          { internalType: 'address', name: 'collection', type: 'address' },
          {
            components: [
              { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
              { internalType: 'uint256', name: 'numTokens', type: 'uint256' }
            ],
            internalType: 'struct OrderTypes.TokenInfo[]',
            name: 'tokens',
            type: 'tuple[]'
          }
        ],
        internalType: 'struct OrderTypes.OrderItem[][]',
        name: 'takerNfts',
        type: 'tuple[][]'
      }
    ],
    name: 'takeOrders',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      {
        components: [
          { internalType: 'address', name: 'collection', type: 'address' },
          {
            components: [
              { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
              { internalType: 'uint256', name: 'numTokens', type: 'uint256' }
            ],
            internalType: 'struct OrderTypes.TokenInfo[]',
            name: 'tokens',
            type: 'tuple[]'
          }
        ],
        internalType: 'struct OrderTypes.OrderItem[]',
        name: 'items',
        type: 'tuple[]'
      }
    ],
    name: 'transferMultipleNFTs',
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
  { inputs: [], name: 'unpause', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [{ internalType: 'address', name: '_matchExecutor', type: 'address' }],
    name: 'updateMatchExecutor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint32', name: '_newProtocolFeeBps', type: 'uint32' }],
    name: 'updateProtocolFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint32', name: '_newWethTransferGasUnits', type: 'uint32' }],
    name: 'updateWethTransferGas',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'userMinOrderNonce',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'wethTransferGasUnits',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'destination', type: 'address' }],
    name: 'withdrawETH',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'destination', type: 'address' },
      { internalType: 'address', name: 'currency', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'withdrawTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
