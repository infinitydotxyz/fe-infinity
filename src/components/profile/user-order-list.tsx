import { Menu } from '@headlessui/react';
import { ChainOBOrder, Order, OrderItemToken, SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import {
  BaseOrderQuery,
  CollectionSearchDto,
  MakerOrdersQuery,
  TakerOrdersQuery
} from '@infinityxyz/lib-frontend/types/dto';
import { UserProfileDto } from '@infinityxyz/lib-frontend/types/dto/user';
import { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { apiGet, ellipsisAddress, extractErrorMsg, ITEMS_PER_PAGE } from 'src/utils';
import { cancelAllOrders } from 'src/utils/exchange/orders';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { fetchOrderNonce } from 'src/utils/orderbookUtils';
import { borderColor, brandTextColor, hoverColorBrandText, secondaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { AOutlineButton } from '../astra/astra-button';
import {
  ACustomMenuButton,
  ACustomMenuContents,
  ACustomMenuItems,
  ADropdown,
  ADropdownButton
} from '../astra/astra-dropdown';
import {
  CenteredContent,
  EZImage,
  ScrollLoader,
  Spacer,
  Spinner,
  TextInputBox,
  toastError,
  toastInfo,
  toastSuccess
} from '../common';
import { CollectionSearchInput } from '../common/search/collection-search-input';
import { UserOrderListItem } from './user-order-list-item';

export const DEFAULT_ORDER_TYPE_FILTER = 'listings';

enum Side {
  Maker = 'maker',
  Taker = 'taker'
}

enum OrderStatus {
  Active = 'active',
  Inactive = 'inactive',
  Filled = 'filled',
  Cancelled = 'cancelled',
  Expired = 'expired'
}

enum OrderBy {
  Price = 'price',
  StartTime = 'startTime',
  EndTime = 'endTime'
}

export type UserOrderFilter = {
  orderType?: 'listings' | 'offers-made' | 'offers-received' | '';
  minPrice?: string;
  maxPrice?: string;
  numItems?: string;
  collections?: string[];
  orderBy?: OrderBy;
};

interface Props {
  userInfo: UserProfileDto;
  className?: string;
  toggleOrderSelection: (data: SignedOBOrder) => void;
  isOrderSelected: (data: SignedOBOrder) => boolean;
}

export const UserOrderList = ({ userInfo, className = '', toggleOrderSelection, isOrderSelected }: Props) => {
  const { user, chainId, waitForTransaction, getSigner } = useOnboardContext();

  const [minPriceVal, setMinPriceVal] = useState('');
  const [maxPriceVal, setMaxPriceVal] = useState('');
  const [data, setData] = useState<SignedOBOrder[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [cursor, setCursor] = useState('');
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isCancellingAll, setIsCancellingAll] = useState(false);
  const [apiFilter, setApiFilter] = useState<UserOrderFilter>({ orderType: DEFAULT_ORDER_TYPE_FILTER });
  const [ddLabel, setDdLabel] = useState<string>('Listings');
  const [filter, setFilter] = useState<UserOrderFilter>({
    orderType: DEFAULT_ORDER_TYPE_FILTER
  });
  const [selectedCollection, setSelectedCollection] = useState<CollectionSearchDto>();

  const handleCollectionSearchResult = (result: CollectionSearchDto) => {
    setSelectedCollection(result);
    const newFilter = { ...filter };
    newFilter.collections = [result.address];
    setFilter(newFilter);
    setApiFilter(newFilter);
  };

  const handleCollectionSearchClear = () => {
    setSelectedCollection(undefined);
    const newFilter = { ...filter };
    newFilter.collections = [];
    setFilter(newFilter);
    setApiFilter(newFilter);
  };

  const fetchData = async (isRefresh = false) => {
    setIsFetching(true);
    let newCursor = cursor;
    if (isRefresh) {
      newCursor = '';
    }

    const baseQuery: BaseOrderQuery = {
      limit: ITEMS_PER_PAGE,
      cursor: newCursor,
      minPrice: parseFloat(apiFilter.minPrice ?? ''),
      maxPrice: parseFloat(apiFilter.maxPrice ?? ''),
      orderBy: apiFilter.orderBy
    };

    let query: MakerOrdersQuery | TakerOrdersQuery | BaseOrderQuery = { ...baseQuery };
    if (apiFilter.orderType === 'listings') {
      query = {
        isSellOrder: true,
        side: Side.Maker
      };
    } else if (apiFilter.orderType === 'offers-made') {
      query = {
        isSellOrder: false,
        side: Side.Maker
      };
    } else if (apiFilter.orderType === 'offers-received') {
      query = {
        isSellOrder: false,
        side: Side.Taker,
        status: OrderStatus.Active
      };
    }

    const collection = apiFilter.collections?.[0] ?? ''; // api only supports 1 collection for now
    if (collection) {
      query = {
        ...query,
        collection
      };
    }

    const { result } = await apiGet(`/v2/users/${userInfo.address}/orders`, {
      query,
      requiresAuth: true
    });

    if (result?.hasNextPage === true) {
      setCursor(result?.cursor);
    }

    setHasNextPage(result?.hasNextPage);

    let newData;
    if (isRefresh) {
      newData = [...result.data];
    } else {
      newData = [...data, ...result.data];
    }

    setIsFetching(false);

    setData(
      newData.map((order: Order) => {
        const orderItems = order.kind === 'single-collection' ? [order.item] : order.items;
        const nfts = orderItems.map((item) => {
          let tokens: OrderItemToken[];
          switch (item.kind) {
            case 'collection-wide':
              tokens = [];
              break;
            case 'single-token':
              tokens = [item.token];
              break;

            case 'token-list':
              tokens = item.tokens;
              break;
          }

          const chainTokens = tokens.map((item) => {
            return {
              tokenId: item.tokenId,
              tokenName: item.name,
              tokenImage: item.image,
              takerUsername: item.owner?.username,
              takerAddress: item.owner?.address,
              numTokens: item.quantity,
              attributes: []
            };
          });
          return {
            chainId: order.chainId,
            collectionAddress: item.address,
            collectionName: item.name,
            collectionImage: item.profileImage,
            collectionSlug: item.slug,
            hasBlueCheck: item.hasBlueCheck,
            tokens: chainTokens
          };
        });

        const signedObOrder: SignedOBOrder = {
          id: order.id,
          chainId: order.chainId,
          isSellOrder: order.isSellOrder,
          numItems: order.numItems,
          makerUsername: order.maker?.username,
          makerAddress: order.maker?.address,
          startPriceEth: order.startPriceEth,
          endPriceEth: order.endPriceEth,
          startTimeMs: order.startTimeMs,
          endTimeMs: order.endTimeMs,
          maxGasPriceWei: '0',
          nonce: 0,
          nfts: nfts,
          execParams: {
            complicationAddress: '',
            currencyAddress: order.currency
          },
          extraParams: {
            buyer: order.isPrivate ? order.taker.address : ''
          },
          signedOrder: {} as unknown as ChainOBOrder
        };

        return signedObOrder;
      })
    );
  };

  useEffect(() => {
    setData([]);
    fetchData(true);
  }, [apiFilter]);

  const onClear = () => {
    const newFilter = { ...filter };
    newFilter.minPrice = '';
    newFilter.maxPrice = '';
    setFilter(newFilter);
    setApiFilter(newFilter);
  };

  const onClickAcceptOfferCancelOrder = (order: SignedOBOrder) => {
    if (apiFilter.orderType === 'offers-received') {
      // no op in this release; in future allow users to accept offers
    } else {
      toggleOrderSelection(order);
    }
  };

  const onClickOrderType = (newType: 'listings' | 'offers-made' | 'offers-received' | '') => {
    const newFilter = {
      ...filter,
      orderType: newType
    };
    setFilter(newFilter);
    setApiFilter(newFilter);
  };

  return (
    <div className={twMerge('min-h-[50vh]', className)}>
      <div className={twMerge(borderColor, 'w-full flex py-2 px-4 border-t-[1px] space-x-2')}>
        <div className="">
          <CollectionSearchInput
            expanded
            orderSearch
            setSelectedCollection={(value) => {
              handleCollectionSearchResult(value);
            }}
          />
        </div>

        {selectedCollection && (
          <div className={twMerge('flex items-center rounded-lg border px-2', borderColor)}>
            <div className="flex items-center">
              <EZImage src={selectedCollection.profileImage} className="w-6 h-6 rounded-full mr-2" />
              <div className="text-sm font-medium">{selectedCollection.name}</div>
            </div>
            <div className="ml-2">
              <MdClose
                className={twMerge('h-4 w-4 cursor-pointer', hoverColorBrandText)}
                onClick={() => {
                  handleCollectionSearchClear();
                }}
              />
            </div>
          </div>
        )}

        <Spacer />

        <ADropdown
          label={ddLabel}
          items={[
            {
              label: 'Listings',
              onClick: () => {
                setDdLabel('Listings');
                onClickOrderType('listings');
              }
            },
            {
              label: 'Offers made',
              onClick: () => {
                setDdLabel('Offers made');
                onClickOrderType('offers-made');
              }
            },
            {
              label: 'Offers received',
              onClick: () => {
                setDdLabel('Offers received');
                onClickOrderType('offers-received');
              }
            }
          ]}
        />

        <Menu>
          {({ open }) => (
            <ACustomMenuContents>
              <span>
                <ACustomMenuButton>
                  <AOutlineButton tooltip="Filter by price">
                    <ADropdownButton>Price</ADropdownButton>
                  </AOutlineButton>
                </ACustomMenuButton>
              </span>

              <ACustomMenuItems open={open} alignMenuRight={true} innerClassName="border-0">
                <div className="flex mr-2">
                  <TextInputBox
                    addEthSymbol={true}
                    type="number"
                    className="font-heading p-3"
                    label="Min"
                    placeholder=""
                    value={minPriceVal}
                    onChange={(value) => {
                      setMinPriceVal(value);
                      const newFilter = { ...filter };
                      newFilter.minPrice = value;
                      newFilter.orderBy = OrderBy.Price;
                      setFilter(newFilter);
                      setApiFilter(newFilter);
                    }}
                  />
                  <TextInputBox
                    addEthSymbol={true}
                    type="number"
                    className="font-heading ml-2 p-3"
                    label="Max"
                    placeholder=""
                    value={maxPriceVal}
                    onChange={(value) => {
                      setMaxPriceVal(value);
                      const newFilter = { ...filter };
                      newFilter.maxPrice = value;
                      newFilter.orderBy = OrderBy.Price;
                      setFilter(newFilter);
                      setApiFilter(newFilter);
                    }}
                  />
                </div>
                <Menu.Button onClick={onClear} className={twMerge('mt-4 ml-1 text-sm', brandTextColor)}>
                  Clear
                </Menu.Button>
              </ACustomMenuItems>
            </ACustomMenuContents>
          )}
        </Menu>

        <AOutlineButton
          className={twMerge('font-medium text-sm', secondaryTextColor, hoverColorBrandText)}
          disabled={isCancellingAll}
          onClick={async () => {
            try {
              const signer = getSigner();
              if (signer && user) {
                const minOrderNonce = await fetchOrderNonce(user.address);
                const { hash } = await cancelAllOrders(signer, chainId, minOrderNonce);
                toastSuccess('Sent txn to chain for execution');
                setIsCancellingAll(true);
                waitForTransaction(hash, () => {
                  toastInfo(`Transaction confirmed ${ellipsisAddress(hash)}`);
                });
                setIsCancellingAll(false);
              } else {
                throw 'User is null';
              }
            } catch (err) {
              toastError(extractErrorMsg(err));
            }
          }}
        >
          Cancel all
        </AOutlineButton>
      </div>

      <div className="flex">
        <div className="w-full pointer-events-auto">
          {isFetching && (
            <div className="">
              <CenteredContent>
                <Spinner />
              </CenteredContent>
            </div>
          )}

          {!isFetching && hasNextPage === false && data?.length === 0 ? (
            <CenteredContent>
              <div className="font-heading">No results found</div>
            </CenteredContent>
          ) : null}

          {data?.map((order, idx) => {
            return (
              <UserOrderListItem
                key={idx}
                order={order}
                orderType={apiFilter.orderType}
                userInfo={userInfo}
                selected={isOrderSelected(order)}
                onClickActionBtn={onClickAcceptOfferCancelOrder}
              />
            );
          })}

          {hasNextPage === true ? (
            <ScrollLoader
              onFetchMore={async () => {
                await fetchData();
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};
