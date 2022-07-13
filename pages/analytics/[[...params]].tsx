import { Tab } from '@headlessui/react';
import { CollectionStats } from '@infinityxyz/lib-frontend/types/core';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';
import { Field } from 'src/components/analytics/field';
import {
  Button,
  Checkbox,
  Drawer,
  PageBox,
  ScrollLoader,
  Spacer,
  ToggleTab,
  useToggleTab
} from 'src/components/common';
import { truncateDecimals } from 'src/utils';
import { useFetch } from 'src/utils/apiUtils';
import { MISSING_IMAGE_URL, ITEMS_PER_PAGE } from 'src/utils/constants';
import { useAppContext } from 'src/utils/context/AppContext';

type StatColType = {
  id?: string;
  type?: string;
  label?: string;
  value?: string | number;
  placement?: string;
  sortable?: boolean;
  fraction?: string;
  show?: boolean;
  onSort?: (direction: string) => void;
  onClick?: () => void;
};

type StatType = {
  data: CollectionStats;
  cols: StatColType[];
};

export const Analytics = () => {
  const router = useRouter();
  const { user, chainId } = useAppContext();
  const connected = user?.address ? true : false;
  const [page, setPage] = useState(router.query.params?.[0] ? router.query.params?.[0] : 'trending');
  const [interval, setInterval] = useState(router.query.params?.[1] ? router.query.params?.[1] : 'weekly');
  const [date] = useState(Date.now());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filterLimit] = useState(6);
  const [orderBy, setOrderBy] = useState('volume');
  const [orderDirection, setOrderDirection] = useState('desc');
  const [cursor, setCursor] = useState('');
  const [items, setItems] = useState<CollectionStats[]>([]);
  const [stats, setStats] = useState<StatType[]>([]);

  const [columns, setColumns] = useState<{ [key: string]: boolean }>({
    floorPrice: true,
    floorPricePercentChange: true,
    volume: true,
    volumePercentChange: true,
    numNfts: true,
    numOwners: true,
    twitterFollowers: false,
    twitterFollowersPercentChange: false,
    discordFollowers: false,
    discordFollowersPercentChange: false
  });

  const [filterCheckboxes, setFilterCheckboxes] = useState<{ [key: string]: boolean }>(columns);
  const { options, onChange, selected } = useToggleTab(['1 hr', '1 day', '7 days', '30 days', 'All'], '7 days');

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const toggleDrawer = () => {
    isDrawerOpen ? setIsDrawerOpen(false) : setIsDrawerOpen(true);
  };

  useEffect(() => {
    if (!connected) {
      setPage('trending');
    }
  }, [connected]);

  useEffect(() => {
    setItems([]);
  }, [page]);

  useEffect(() => {
    if (page === 'trending') {
      void router.push(
        {
          pathname: `/analytics/${page}/${interval}`
        },
        undefined,
        { scroll: false }
      );
    } else {
      void router.push(
        {
          pathname: `/analytics/${page}`
        },
        undefined,
        { scroll: false }
      );
    }
  }, [page, interval, orderBy, orderDirection]);

  const clearCheckboxes = () => {
    const reset = {
      floorPrice: true,
      floorPricePercentChange: true,
      volume: true,
      volumePercentChange: true,
      numNfts: true,
      numOwners: true,
      twitterFollowers: false,
      twitterFollowersPercentChange: false,
      discordFollowers: false,
      discordFollowersPercentChange: false
    };
    setFilterCheckboxes(reset);
    setColumns(reset);
  };

  const applyCheckboxes = () => {
    // if (Object.keys(filterCheckboxes).filter((key) => filterCheckboxes[key]).length < filterLimit) {
    //   setColumns(filterCheckboxes);
    //   setIsDrawerOpen(false);
    // }
    setColumns(filterCheckboxes);
    setFilterCheckboxes(filterCheckboxes);
    setIsDrawerOpen(false);
    setCursor('');
    void router.push(
      {
        pathname: `/analytics/${page}/${interval}`
      },
      undefined,
      { scroll: false }
    );
  };

  const checkboxToggle = (id: string) => setFilterCheckboxes({ ...filterCheckboxes, [id]: !filterCheckboxes[id] });

  const query =
    page === 'trending'
      ? `/collections/rankings?orderBy=${orderBy}&orderDirection=${orderDirection}&period=${interval}&date=${date}&limit=${ITEMS_PER_PAGE}&cursor=${cursor}`
      : `/user/${chainId}:${user?.address}/watchlist?orderBy=${orderBy}&orderDirection=${orderDirection}&period=${interval}&date=${date}&limit=${ITEMS_PER_PAGE}`;

  const data = useFetch<{ data: CollectionStats[]; cursor: string }>(query);

  if (data.result) {
    if (
      data?.result?.data[0] &&
      items.findIndex((obj) => obj.collectionAddress === data?.result?.data[0].collectionAddress) < 0
    ) {
      setItems([...items, ...data.result.data]);
    }
  }

  useEffect(() => {
    const statistics = items.map((d, index) => {
      const address = d.collectionAddress;
      const name = d.name;
      const image = d.profileImage ? d.profileImage : MISSING_IMAGE_URL;
      // const trust = d.votesFor > 0 ? `${(d.votesFor / (d.votesAgainst + d.votesFor)) * 100}%` : '0%';
      const items = d.numNfts ? d.numNfts : '-';
      const owners = d.numOwners ? d.numOwners : '-';
      const volume = d.volume ? d.volume : '-';
      const floorPrice = d.floorPrice ? d.floorPrice : '-';
      const volumePercentChange = d.volumePercentChange ? d.volumePercentChange.toFixed(1) : '-';
      const floorPricePercentChange = d.floorPricePercentChange ? d.floorPricePercentChange.toFixed(1) : '-';
      const twitterFollowers = d.twitterFollowers ? d.twitterFollowers : '-';
      const twitterFollowersPercentChange = d.twitterFollowersPercentChange ? d.twitterFollowersPercentChange : '-';
      const discordFollowers = d.discordFollowers ? d.discordFollowers : '-';
      const discordFollowersPercentChange = d.discordFollowersPercentChange ? d.discordFollowersPercentChange : '-';
      return {
        data: d,
        cols: [
          {
            id: 'index',
            type: 'index',
            value: index + 1,
            placement: 'start',
            sortable: false,
            fraction: '2fr'
          },
          {
            id: 'image',
            type: 'image',
            value: image,
            placement: 'start',
            sortable: false,
            fraction: '2fr'
          },
          {
            id: 'name',
            type: 'string',
            value: name,
            placement: 'start',
            sortable: false,
            fraction: '4fr',
            onSort: (direction: string) => {
              setOrderDirection(direction);
              setOrderBy('name');
            },
            onClick: () => {
              // eslint-disable-next-line
              router.push(`/collection/${(d as any).slug}`); // TODO: adding slug to type
            }
          },
          {
            id: 'numNfts',
            label: 'Items',
            type: 'number',
            value: items.toLocaleString(),
            show: columns['numNfts'],
            placement: 'middle',
            sortable: false,
            fraction: '3fr',
            onSort: (direction: string) => {
              setOrderDirection(direction);
              setOrderBy('numNfts');
            }
          },
          {
            id: 'numOwners',
            label: 'Owners',
            type: 'number',
            value: owners.toLocaleString(),
            show: columns['numOwners'],
            placement: 'middle',
            sortable: false,
            fraction: '3fr',
            onSort: (direction: string) => {
              setOrderDirection(direction);
              setOrderBy('numOwners');
            }
          },
          {
            id: 'volume',
            label: 'Volume',
            type: 'number',
            value: `Ξ ${truncateDecimals(volume.toLocaleString())}`,
            show: columns['volume'],
            placement: 'middle',
            sortable: true,
            fraction: '3fr',
            onSort: (direction: string) => {
              setOrderDirection(direction);
              setOrderBy('volume');
            }
          },
          {
            id: 'volumePercentChange',
            label: 'Volume %',
            type: 'change',
            value: volumePercentChange,
            show: columns['volumePercentChange'],
            placement: 'middle',
            sortable: true,
            fraction: '3fr',
            onSort: (direction: string) => {
              setOrderDirection(direction);
              setOrderBy('volumePercentChange');
            }
          },
          {
            id: 'floorPrice',
            label: 'Floor price',
            type: 'number',
            value: `Ξ ${floorPrice.toLocaleString()}`,
            show: columns['floorPrice'],
            placement: 'middle',
            sortable: true,
            onSort: (direction: string) => {
              setOrderDirection(direction);
              setOrderBy('floorPrice');
            }
          },
          {
            id: 'floorPricePercentChange',
            label: 'Floor %',
            type: 'change',
            value: floorPricePercentChange,
            show: columns['floorPricePercentChange'],
            placement: 'middle',
            sortable: true,
            fraction: '3fr',
            onSort: (direction: string) => {
              setOrderDirection(direction);
              setOrderBy('floorPricePercentChange');
            }
          },
          {
            id: 'discordFollowers',
            label: 'Discord followers',
            type: 'number',
            value: `${discordFollowers.toLocaleString()}`,
            show: columns['discordFollowers'],
            placement: 'middle',
            sortable: true,
            fraction: '3fr',
            onSort: (direction: string) => {
              setOrderDirection(direction);
              setOrderBy('discordFollowers');
            }
          },
          {
            id: 'discordFollowersPercentChange',
            label: 'Discord %',
            type: 'change',
            value: `${discordFollowersPercentChange.toLocaleString()}`,
            show: columns['discordFollowersPercentChange'],
            placement: 'middle',
            sortable: true,
            fraction: '3fr',
            onSort: (direction: string) => {
              setOrderDirection(direction);
              setOrderBy('discordFollowersPercentChange');
            }
          },
          {
            id: 'twitterFollowers',
            label: 'Twitter followers',
            type: 'number',
            value: `${twitterFollowers.toLocaleString()}`,
            show: columns['twitterFollowers'],
            placement: 'middle',
            sortable: true,
            fraction: '3fr',
            onSort: (direction: string) => {
              setOrderDirection(direction);
              setOrderBy('twitterFollowers');
            }
          },
          {
            id: 'twitterFollowersPercentChange',
            label: 'Twitter %',
            type: 'change',
            value: `${twitterFollowersPercentChange.toLocaleString()}`,
            show: columns['twitterFollowersPercentChange'],
            placement: 'middle',
            sortable: true,
            fraction: '3fr',
            onSort: (direction: string) => {
              setOrderDirection(direction);
              setOrderBy('twitterFollowersPercentChange');
            }
          },
          {
            id: 'followCollection',
            type: 'action',
            label: '',
            value: address,
            placement: 'end',
            props: {},
            fraction: '2fr'
          }
        ]
      };
    });
    setStats(statistics);
  }, [items, columns]);

  useEffect(() => {
    setItems([]);
    setCursor('');
  }, [page, interval, orderBy, orderDirection]);

  const content = {
    filter: {
      limit: 5,
      params: [
        {
          id: 'floorPrice',
          label: 'Floor price',
          props: {
            checked: filterCheckboxes['floorPrice'],
            defaultChecked: filterCheckboxes['floorPrice'],
            onChange: () => checkboxToggle('floorPrice')
          }
        },
        {
          id: 'floorPricePercentChange',
          label: 'Floor price %',
          props: {
            checked: filterCheckboxes['floorPricePercentChange'],
            defaultChecked: filterCheckboxes['floorPricePercentChange'],
            onChange: () => checkboxToggle('floorPricePercentChange')
          }
        },
        {
          id: 'volume',
          label: 'Volume',
          props: {
            checked: filterCheckboxes['volume'],
            defaultChecked: filterCheckboxes['volume'],
            onChange: () => checkboxToggle('volume')
          }
        },
        {
          id: 'volumePercentChange',
          label: 'Volume %',
          props: {
            checked: filterCheckboxes['volumePercentChange'],
            defaultChecked: filterCheckboxes['volumePercentChange'],
            onChange: () => checkboxToggle('volumePercentChange')
          }
        },
        {
          id: 'numNfts',
          label: 'Items',
          props: {
            checked: filterCheckboxes['numNfts'],
            defaultChecked: filterCheckboxes['numNfts'],
            onChange: () => checkboxToggle('numNfts')
          }
        },
        {
          id: 'numOwners',
          label: 'Owners',
          props: {
            checked: filterCheckboxes['numOwners'],
            defaultChecked: filterCheckboxes['numOwners'],
            onChange: () => checkboxToggle('numOwners')
          }
        },
        {
          id: 'twitterFollowers',
          label: 'Twitter followers',
          props: {
            checked: filterCheckboxes['twitterFollowers'],
            defaultChecked: filterCheckboxes['twitterFollowers'],
            onChange: () => checkboxToggle('twitterFollowers')
          }
        },
        {
          id: 'twitterFollowersPercentChange',
          label: 'Twitter %',
          props: {
            checked: filterCheckboxes['twitterFollowersPercentChange'],
            defaultChecked: filterCheckboxes['twitterFollowersPercentChange'],
            onChange: () => checkboxToggle('twitterFollowersPercentChange')
          }
        },
        {
          id: 'discordFollowers',
          label: 'Discord members',
          props: {
            checked: filterCheckboxes['discordFollowers'],
            defaultChecked: filterCheckboxes['discordFollowers'],
            onChange: () => checkboxToggle('discordFollowers')
          }
        },
        {
          id: 'discordFollowersPercentChange',
          label: 'Discord %',
          props: {
            checked: filterCheckboxes['discordFollowersPercentChange'],
            defaultChecked: filterCheckboxes['discordFollowersPercentChange'],
            onChange: () => checkboxToggle('discordFollowersPercentChange')
          }
        }
      ]
    },
    options: {
      actions: {
        links: [
          {
            type: 'link',
            id: 'trending',
            url: `/analytics/trending/${interval}`,
            label: 'Trending'
          },
          ...(connected
            ? [
                {
                  type: 'link',
                  id: 'following',
                  url: `/analytics/following`,
                  label: 'Following'
                }
              ]
            : [])
        ]
      }
    }
  };

  const tabStyles = {
    className: ({ selected }: { selected: boolean }) => `
            w-content h-content
            ${selected ? 'bg-theme-light-900 text-theme-light-50' : 'text-theme-light-800'}
            px-6 py-2 rounded-full
            font-mono font-bold text-sm
          `
  };

  return (
    <PageBox title="Analytics">
      <div className="w-full h-full flex flex-col gap-2">
        <div className="w-full items-center flex-[0.2] grid grid-rows-1 grid-cols-24">
          <ToggleTab
            className="font-heading"
            options={options}
            selected={selected}
            onChange={(value) => {
              onChange(value);

              switch (value) {
                case '1 hr':
                  setInterval('hourly');
                  break;
                case '1 day':
                  setInterval('daily');
                  break;
                case '7 days':
                  setInterval('weekly');
                  break;
                case '30 days':
                  setInterval('monthly');
                  break;
                case 'All':
                  setInterval('all');
                  break;
              }
            }}
          />

          <Tab.Group
            defaultIndex={content?.options?.actions?.links?.findIndex((x) => x.id === page)}
            onChange={(index: number): void => {
              setPage(content?.options?.actions?.links?.[index]?.id);
            }}
          >
            <Tab.List className="w-full h-full  row-start-1 col-start-13 row-span-1 col-span-12 flex justify-end gap-2 py-4">
              {content?.options?.actions?.links?.map((link, i) => (
                <Fragment key={i}>
                  <Tab {...tabStyles}>{link?.label}</Tab>
                </Fragment>
              ))}

              <Button variant="outline" className="font-heading" onClick={() => toggleDrawer()}>
                Filter
              </Button>
            </Tab.List>
          </Tab.Group>
        </div>

        <div className="w-full h-full flex-[1.4]  grid grid-rows-1 grid-cols-24">
          <div className="w-full h-full row-start-1 col-start-1 row-span-1 col-span-24  ring ring-inset ring-transparent flex flex-col gap-2">
            {/* {data.isLoading ? (
              <LoadingAnalytics />
            ) : data.isError || statistics?.length === 0 ? (
              <>
                {Array.from(Array(ITEMS_PER_PAGE).keys())?.map((x, i) => (
                  <Fragment key={i}>
                    <div className="w-full h-[170px] bg-red-50 ring ring-inset ring-red-100 rounded-xl animate-pulse"></div>
                  </Fragment>
                ))}
              </>
            ) : (
              <> */}
            {stats?.map((stat, idx) => {
              return (
                <div key={idx + '_' + stat.data.collectionAddress} className="mb-2">
                  <div className="w-full h-full p-8 overflow-hidden rounded-3xl bg-gray-100 grid grid-cols-analytics place-items-center">
                    {stat?.cols
                      ?.filter((s) => s.placement === 'start')
                      .map((field, j) => (
                        <Fragment key={j}>
                          <div className="w-full h-full  row-span-1 col-span-1">
                            <Field
                              type={field?.type}
                              label={field?.label}
                              value={field?.value}
                              onClick={field?.onClick}
                            />
                            <div className=""></div>
                          </div>
                        </Fragment>
                      ))}
                    {stat?.cols
                      ?.filter((s) => s.placement === 'middle' && s.show === true)
                      .splice(0, filterLimit)
                      .map((field, j) => (
                        <Fragment key={j}>
                          <div className="w-full h-full  row-span-1 col-span-1">
                            <Field
                              sortable={field?.sortable}
                              onSort={field?.onSort}
                              type={field?.type}
                              label={field?.label}
                              value={field?.value}
                              onClick={field?.onClick}
                            />
                            <div className=""></div>
                          </div>
                        </Fragment>
                      ))}

                    {stat?.cols
                      ?.filter((s) => s.placement === 'end')
                      .map((field, j) => {
                        return (
                          <Fragment key={j}>
                            <div className="w-full h-full  row-span-1 col-span-1">
                              <Field type={field?.type} label={field?.label} value={field?.value} content="" />
                              <div className=""></div>
                            </div>
                          </Fragment>
                        );
                      })}
                  </div>
                </div>
              );
            })}

            {data.isLoading && <LoadingAnalytics />}

            <ScrollLoader
              onFetchMore={() => {
                if (data?.result?.cursor) {
                  setCursor(data?.result?.cursor);
                }
              }}
            />
          </div>
        </div>
      </div>

      <Drawer
        open={isDrawerOpen}
        onClose={closeDrawer}
        title="Filter"
        subtitle={`Select up to ${filterLimit}`}
        divide={true}
      >
        <div className="w-full h-full flex flex-col px-12">
          <div className="w-full h-full flex flex-col space-y-4">
            {content?.filter?.params?.map((x, i) => (
              <Checkbox
                key={i}
                label={x?.label}
                checked={x?.props.checked}
                onChange={x?.props.onChange}
                boxOnLeft={false}
              />
            ))}
          </div>

          <Spacer />

          <div className="w-full flex flex-row gap-4 py-2 mb-6">
            <Button variant="outline" onClick={clearCheckboxes} className="flex-1">
              Clear all
            </Button>

            <Button
              disabled={Object.keys(filterCheckboxes).filter((key) => filterCheckboxes[key]).length > filterLimit}
              onClick={applyCheckboxes}
              className="flex-1"
            >
              Apply
            </Button>
          </div>
        </div>
      </Drawer>
    </PageBox>
  );
};

export default Analytics;

// =======================================================================

const LoadingAnalytics = () => (
  <>
    {Array.from(Array(Math.round(ITEMS_PER_PAGE / 2)).keys())?.map((x, i) => (
      <Fragment key={i}>
        <div className="w-full h-[110px] mt-1 bg-theme-light-200 rounded-3xl animate-pulse"></div>
      </Fragment>
    ))}
  </>
);
