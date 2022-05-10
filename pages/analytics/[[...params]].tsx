import React, { Fragment, useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';
import { useRouter } from 'next/router';
import { useFetch } from 'src/utils/apiUtils';
import { Button, Checkbox, Drawer, PageBox } from 'src/components/common';
import { Field } from 'src/components/analytics/field';
import { useAppContext } from 'src/utils/context/AppContext';
import { CollectionStats } from '@infinityxyz/lib/types/core';
import { ITEMS_PER_PAGE, BLANK_IMG } from 'src/utils/constants';
import ContentLoader from 'react-content-loader';

export const Analytics = () => {
  const router = useRouter();
  const { user } = useAppContext();
  const connected = user?.address ? true : false;
  const [page, setPage] = useState(router.query.params?.[0] ? router.query.params?.[0] : 'trending');
  const [interval, setInterval] = useState(router.query.params?.[1] ? router.query.params?.[1] : 'weekly');
  const [date] = useState(Date.now());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filterLimit] = useState(6);
  const [orderBy, setOrderBy] = useState('volume');
  const [orderDirection, setOrderDirection] = useState('desc');

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
    void router.push(
      {
        pathname: `/analytics/${page}/${interval}`
      },
      undefined,
      { scroll: false }
    );
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
    if (Object.keys(filterCheckboxes).filter((key) => filterCheckboxes[key]).length < filterLimit) {
      setColumns(filterCheckboxes);
      setIsDrawerOpen(false);
    }
  };

  const checkboxToggle = (id: string) => setFilterCheckboxes({ ...filterCheckboxes, [id]: !filterCheckboxes[id] });

  const query =
    page === 'trending'
      ? `/collections/rankings?orderBy=${orderBy}&orderDirection=${orderDirection}&period=${interval}&date=${date}&limit=${ITEMS_PER_PAGE}`
      : `/user/1:${user?.address}/watchlist?orderBy=${orderBy}&orderDirection=${orderDirection}&period=${interval}&date=${date}&limit=${ITEMS_PER_PAGE}`;

  const data = useFetch<{ data: CollectionStats[] }>(query);

  let statistics = null;
  if (data.result) {
    statistics = data.result.data.map((d, index) => {
      const address = d.collectionAddress;
      const name = d.name;
      const image = d.profileImage ? d.profileImage : BLANK_IMG;
      // const trust = d.votesFor > 0 ? `${(d.votesFor / (d.votesAgainst + d.votesFor)) * 100}%` : '0%';
      const items = d.numNfts ? d.numNfts : '-';
      const owners = d.numOwners ? d.numOwners : '-';
      const volume = d.volume ? d.volume.toFixed(1) : '-';
      const floorPrice = d.floorPrice ? d.floorPrice : '-';
      const volumePercentChange = d.volumePercentChange ? d.volumePercentChange.toFixed(1) : '-';
      const floorPricePercentChange = d.floorPricePercentChange ? d.floorPricePercentChange.toFixed(1) : '-';
      const twitterFollowers = d.twitterFollowers ? d.twitterFollowers : '-';
      const twitterFollowersPercentChange = d.twitterFollowersPercentChange ? d.twitterFollowersPercentChange : '-';
      const discordFollowers = d.discordFollowers ? d.discordFollowers : '-';
      const discordFollowersPercentChange = d.discordFollowersPercentChange ? d.discordFollowersPercentChange : '-';
      return [
        {
          id: 'index',
          type: 'index',
          value: index + 1,
          placement: 'start',
          sortable: false,
          onSort: null,
          fraction: '2fr'
        },
        {
          id: 'image',
          type: 'image',
          value: image,
          placement: 'start',
          sortable: false,
          onSort: null,
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
          value: `Ξ ${volume.toLocaleString()}`,
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
          label: 'Vol. change',
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
          label: 'Floor Price',
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
          label: 'Fl. change',
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
          label: 'Discord Followers',
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
          label: 'Discord % change',
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
          label: 'Twitter Followers',
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
          label: 'Discord % change',
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
      ];
    });
  }

  const content = {
    filter: {
      limit: 5,
      params: [
        {
          id: 'floorPrice',
          label: 'Floor Price',
          props: {
            checked: filterCheckboxes['floorPrice'],
            defaultChecked: filterCheckboxes['floorPrice'],
            onChange: () => checkboxToggle('floorPrice')
          }
        },
        {
          id: 'floorPricePercentChange',
          label: 'Floor Price % change',
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
          label: 'Volume % change',
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
          label: 'Twitter Followers',
          props: {
            checked: filterCheckboxes['twitterFollowers'],
            defaultChecked: filterCheckboxes['twitterFollowers'],
            onChange: () => checkboxToggle('twitterFollowers')
          }
        },
        {
          id: 'twitterFollowersPercentChange',
          label: 'Twitter % change',
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
          label: 'Discord % change',
          props: {
            checked: filterCheckboxes['discordFollowersPercentChange'],
            defaultChecked: filterCheckboxes['discordFollowersPercentChange'],
            onChange: () => checkboxToggle('discordFollowersPercentChange')
          }
        }
      ]
    },
    options: {
      timeframes: [
        {
          type: 'tab',
          id: 'hourly',
          url: `/analytics/${page}/hourly`,
          label: '1 hr',
          props: {}
        },
        {
          type: 'tab',
          id: 'daily',
          url: `/analytics/${page}/daily`,
          label: '1 day',
          props: {}
        },
        {
          type: 'tab',
          id: 'weekly',
          url: `/analytics/${page}/weekly`,
          label: '7 days',
          props: {}
        },
        {
          type: 'tab',
          id: 'monthly',
          url: `/analytics/${page}/monthly`,
          label: '30 days',
          props: {}
        },
        {
          type: 'tab',
          id: 'all',
          url: `/analytics/${page}/all`,
          label: 'All',
          props: {}
        }
      ],
      actions: {
        links: [
          {
            type: 'link',
            id: 'trending',
            url: `/analytics/trending/${interval}`,
            label: 'Trending',
            props: {}
          },

          ...(connected
            ? [
                {
                  type: 'link',
                  id: 'following',
                  url: `/analytics/following/${interval}`,
                  label: 'Following ',
                  props: {}
                }
              ]
            : [])
        ],
        buttons: [
          {
            type: 'drawer',
            url: '',
            label: 'Filter'
          }
        ]
      }
    }
  };

  const styles = {
    options: {
      timeframes: {
        tab: {
          className: ({ selected }: { selected: boolean }) => `
            w-content h-content overflow-hidden
            ${selected ? 'bg-theme-light-900 text-theme-light-50' : 'text-theme-light-800'}
            px-6 py-2 rounded-full
            font-mono font-bold text-sm
          `
        }
      },
      actions: {
        tab: {
          className: ({ selected }: { selected: boolean }) => `
            w-content h-content overflow-hidden
            ${selected ? 'bg-theme-light-900 text-theme-light-50' : 'text-theme-light-800'}
            px-6 py-2 rounded-full
            font-mono font-bold text-sm
          `
        }
      }
    },
    statistics: {
      container: {
        className: `
          w-full h-full
           flex-[1.4]
          grid grid-rows-1 grid-cols-24
        `
      },
      list: {
        container: {
          className: `
            w-full h-full
            row-start-1 col-start-1 row-span-1 col-span-24
            ring ring-inset ring-transparent
            flex flex-col gap-2
          `
        },
        loading: {
          className: `
            w-full h-[170px] bg-blue-50 ring ring-inset ring-blue-100 rounded-xl
            animate-pulse
          `
        },
        error: {
          className: `
            w-full h-[170px] bg-red-50 ring ring-inset ring-red-100 rounded-xl
            animate-pulse
          `
        },
        item: {
          container: {
            className: `
              w-full h-full min-h-[144px] overflow-hidden rounded-xl
              bg-theme-light-300
              grid grid-cols-analytics
              
              place-items-center
            `
          },
          field: {
            container: {
              className: `
                w-full h-full
                row-span-1 col-span-1
              `
            }
          }
        }
      }
    },
    drawer: {
      content: {
        form: {
          label: {
            className: `
              w-full h-full overflow-hidden
              flex-[0.8] flex justify-start items-center
              text-gray-700 font-mono text-md
            `
          }
        }
      }
    }
  };
  return (
    <PageBox title="Analytics">
      <div className="w-full h-full flex flex-col gap-2">
        <div className="w-full h-full overflow-hidden  flex-[0.2] grid grid-rows-1 grid-cols-24">
          <Tab.Group
            defaultIndex={content?.options?.timeframes?.findIndex((x) => x.id === interval)}
            onChange={(index: number): void => {
              setInterval(content?.options?.timeframes?.[index]?.id);
            }}
          >
            <div className="row-start-1 col-start-1 row-span-1 col-span-14  grid place-items-start items-center">
              <div className="w-content h-content overflow-hidden  grid rounded-full">
                <Tab.List className="w-content h-content overflow-hidden  bg-theme-light-300 flex flex-row gap-1 p-1 rounded-full">
                  {content?.options?.timeframes?.map((tab, i) => (
                    <Fragment key={i}>
                      <Tab {...styles?.options?.timeframes?.tab}>{tab?.label}</Tab>
                    </Fragment>
                  ))}
                </Tab.List>
              </div>
            </div>
          </Tab.Group>

          <Tab.Group
            defaultIndex={content?.options?.actions?.links?.findIndex((x) => x.id === page)}
            onChange={(index: number): void => {
              setPage(content?.options?.actions?.links?.[index]?.id);
            }}
          >
            <Tab.List className="w-full h-full overflow-hidden  row-start-1 col-start-13 row-span-1 col-span-12 flex justify-end gap-2 py-4">
              {content?.options?.actions?.links?.map((link, i) => (
                <Fragment key={i}>
                  <Tab {...styles?.options?.actions?.tab}>{link?.label}</Tab>
                </Fragment>
              ))}

              {content?.options?.actions?.buttons?.map((tab, i) => (
                <Fragment key={i}>
                  {tab.type === 'drawer' && (
                    <>
                      <Button variant="outline" onClick={() => toggleDrawer()}>
                        {tab?.label}
                      </Button>
                      <Drawer
                        open={isDrawerOpen}
                        onClose={closeDrawer}
                        title="Filter"
                        subtitle={`Select up to ${filterLimit}`}
                        divide={true}
                      >
                        <div className=" w-full h-full overflow-hidden px-12 pb-8">
                          <div>
                            <div className="w-full h-full flex flex-col">
                              {content?.filter?.params?.map((x, i) => (
                                <Fragment key={i}>
                                  <div className="w-full h-full overflow-hidden flex flex-row">
                                    <div className="w-full h-full overflow-hidden text-gray-700 font-mono text-md">
                                      <Checkbox
                                        label={x?.label}
                                        checked={x?.props.checked}
                                        onChange={x?.props.onChange}
                                        boxOnLeft={false}
                                      />
                                    </div>
                                  </div>
                                </Fragment>
                              ))}
                            </div>
                            <div className="w-full h-full overflow-hidden flex flex-row gap-2 py-2">
                              <Button
                                variant="outline"
                                onClick={clearCheckboxes}
                                className="font-heading w-full h-full"
                              >
                                Clear all
                              </Button>
                              <Button
                                disabled={
                                  Object.keys(filterCheckboxes).filter((key) => filterCheckboxes[key]).length >
                                  filterLimit
                                }
                                onClick={applyCheckboxes}
                                className="font-heading w-full h-full"
                              >
                                Apply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Drawer>
                    </>
                  )}
                </Fragment>
              ))}
            </Tab.List>
          </Tab.Group>
        </div>
        <div {...styles?.statistics?.container}>
          <div {...styles?.statistics?.list?.container}>
            {data.isLoading ? (
              <LoadingAnalytics />
            ) : data.isError || statistics?.length === 0 ? (
              <>
                {Array.from(Array(ITEMS_PER_PAGE).keys())?.map((x, i) => (
                  <Fragment key={i}>
                    <div {...styles?.statistics?.list?.error}></div>
                  </Fragment>
                ))}
              </>
            ) : (
              <>
                {statistics?.map((stat, i) => (
                  <Fragment key={i}>
                    <div {...styles?.statistics?.list?.item?.container}>
                      {stat
                        ?.filter((s) => s.placement === 'start')
                        .map((field, j) => (
                          <Fragment key={j}>
                            <div {...styles?.statistics?.list?.item?.field?.container}>
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
                      {stat
                        ?.filter((s) => s.placement === 'middle' && s.show === true)
                        .splice(0, filterLimit)
                        .map((field, j) => (
                          <Fragment key={j}>
                            <div {...styles?.statistics?.list?.item?.field?.container}>
                              <Field
                                sortable={field?.sortable}
                                onSort={field?.onSort}
                                type={field?.type}
                                label={field?.label}
                                value={field?.value}
                              />
                              <div className=""></div>
                            </div>
                          </Fragment>
                        ))}
                      {stat
                        ?.filter((s) => s.placement === 'end')
                        .map((field, j) => (
                          <Fragment key={j}>
                            <div {...styles?.statistics?.list?.item?.field?.container}>
                              <Field type={field?.type} label={field?.label} value={field?.value} />
                              <div className=""></div>
                            </div>
                          </Fragment>
                        ))}
                    </div>
                  </Fragment>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </PageBox>
  );
};

export default Analytics;

// =======================================================================

const LoadingAnalytics = () => (
  <ContentLoader
    speed={2}
    height={650}
    width={'100%'}
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    uniqueKey="loading"
  >
    <rect x="0" y="0" rx="12" ry="12" width="100%" height="144" />
    <rect x="0" y="152" rx="12" ry="12" width="100%" height="144" />
    <rect x="0" y="304" rx="12" ry="12" width="100%" height="144" />
    <rect x="0" y="456" rx="12" ry="12" width="100%" height="144" />
    <rect x="0" y="608" rx="12" ry="12" width="100%" height="144" />
    <rect x="0" y="760" rx="12" ry="12" width="100%" height="144" />
    <rect x="0" y="912" rx="12" ry="12" width="100%" height="144" />
    <rect x="0" y="1064" rx="12" ry="12" width="100%" height="144" />
    <rect x="0" y="1216" rx="12" ry="12" width="100%" height="144" />
    <rect x="0" y="1368" rx="12" ry="12" width="100%" height="144" />
  </ContentLoader>
);
