import React from 'react';
import { Tab } from '@headlessui/react';
import { useRouter } from 'next/router';
import { useFetch } from 'src/utils/apiUtils';
import { Drawer } from 'src/components/common/drawer';
import { Layout } from 'src/components/common/layout';
import { Field } from 'src/components/analytics/field';
import { useAppContext } from 'src/utils/context/AppContext';
import { CollectionStats } from '@infinityxyz/lib/types/core';
import { ITEMS_PER_PAGE, BLANK_IMG } from 'src/utils/constants';

export const Analytics = () => {
  const router = useRouter();
  const { user } = useAppContext();
  const connected = user?.address ? true : false;
  const [limit] = React.useState(ITEMS_PER_PAGE);
  const [page, setPage] = React.useState(router.query.params?.[0] ? router.query.params?.[0] : 'trending');
  const [interval, setInterval] = React.useState(router.query.params?.[1] ? router.query.params?.[1] : 'hourly');
  const [date, setDate] = React.useState(Date.now());
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [filterCheckboxes, setFilterCheckboxes] = React.useState([]);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => (isDrawerOpen ? setIsDrawerOpen(false) : setIsDrawerOpen(true));
  const selectFilterCheckboxes = () => {
    const currentLength = filterCheckboxes.length
    if (currentLength <= limit) filterCheckboxes.push()
  }
  /*
    ======================================
      Following code is required to fetch
      data from BE and then convert it into
      a format that's acceptable to this component.
      Currently it looks kind of dirty, and should
      be updated later to include different
      filter parameters.
    ======================================
  */
  let statistics = null;
  const query =
    page === 'trending'
      ? `/collections/rankings?orderBy=volume&orderDirection=desc&period=${interval}&date=${date}&limit=${limit}`
      : `/user/1:${user?.address}/watchlist?orderBy=volume&orderDirection=desc&period=${interval}&date=${date}&limit=${limit}`;

  const data = useFetch<{ data: CollectionStats[] }>(query);

  if (data.result) {
    statistics = data.result.data.map((d) => {
      const name = d.name;
      const image = d.profileImage ? d.profileImage : BLANK_IMG;
      const trust = d.votesFor > 0 ? `${(d.votesFor / (d.votesAgainst + d.votesFor)) * 100}%` : '0%';
      const items = d.numNfts ? d.numNfts : '-';
      const owners = d.numOwners ? d.numOwners : '-';
      const volume = d.volume ? d.volume : '-';
      const floorPrice = d.floorPrice ? d.floorPrice : '-';
      const volumePercentChange = d.volumePercentChange ? d.volumePercentChange : '-';
      const floorPricePercentChange = d.floorPricePercentChange ? d.floorPricePercentChange : '-';
      const twitterFollowers = d.twitterFollowers ? d.twitterFollowers : '-';
      const twitterPercentageChange = d.twitterPercentageChange ? d.twitterPercentageChange : '-';
      const discordFollowers = d.discordFollowers ? d.discordFollowers : '-';
      const discordPercentageChange = d.discordPercentageChange ? d.discordPercentageChange : '-';
      return [
        {
          id: 'image',
          type: 'image',
          value: image,
          filterable: true,
          sortable: true
        },
        {
          id: 'name',
          type: 'string',
          value: name,
          filterable: true,
          sortable: true
        },
        {
          id: 'numNfts',
          label: 'Items',
          type: 'number',
          value: items.toLocaleString(),
          filterable: true,
          sortable: true
        },
        {
          id: 'owners',
          label: 'Owners',
          type: 'number',
          value: owners.toLocaleString(),
          filterable: true,
          sortable: true
        },
        {
          id: 'volume',
          label: 'Volume',
          type: 'number',
          value: `Ξ ${volume.toLocaleString()}`,
          filterable: true,
          sortable: true
        },
        {
          id: 'volumePercentChange',
          label: 'Vol. change',
          type: 'change',
          value: volumePercentChange
        },
        {
          id: 'floorPrice',
          label: 'Floor Price',
          type: 'number',
          value: `Ξ ${floorPrice.toLocaleString()}`,
          filterable: true,
          sortable: true
        },
        {
          id: 'floorPricePercentChange',
          label: 'Fl. change',
          type: 'change',
          value: floorPricePercentChange,
          filterable: true,
          sortable: true
        },
        {
          type: 'action',
          props: {}
        }
      ];
    });
  }

  React.useEffect(() => {
    /*
      ======================================
        If user logs out when 'following' tab
        is selected (or any other tab that is
        to be shown only when user is connected),
        we'll redirect user to trending page.
        Resetting the date is important for query.
      ======================================
    */
    setDate(Date.now());
    if (!connected) setPage('trending');
  }, [connected]);

  React.useEffect(() => {
    /*
      ======================================
        Whenever page or time interval changes,
        change the URL (so that component refreshes,
        and data is refetched and cached...)
        Resetting the date is important for the query.
      ======================================
    */
    setDate(Date.now());
    router.push(
      {
        pathname: `/analytics/${page}/${interval}`
      },
      undefined,
      { scroll: false }
    );
  }, [page, interval]);

  /*
    ======================================
      This object contains the content
      (both static and dynamic) used in
      the page. Markup cares only about
      this object (and the styles object)
      to show the data, so if you derive some
      state from some hook, update this object
      with it instead.
    ======================================
  */
  const content = {
    title: 'Analytics',
    statistics: statistics,
    filter: {
      limit: 5,
      params: [
        {
          id: 'floorPrice',
          label: 'Floor Price'
        },
        {
          id: 'floorPricePercentChange',
          label: 'Floor Price % change'
        },
        {
          id: 'volume',
          label: 'Volume'
        },
        {
          id: 'volumePercentChange',
          label: 'Volume % change'
        },
        {
          id: 'items',
          label: 'Items'
        },
        {
          id: 'Owners',
          label: 'Owners'
        },
        {
          id: 'twitterFollowers',
          label: 'Twitter Followers'
        },
        {
          id: 'twitterPercentageChange',
          label: 'Twitter % change'
        },
        {
          id: 'discordFollowers',
          label: 'Discord members'
        },
        {
          id: 'discordPercentageChange',
          label: 'Discord % change'
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
          /*
            ======================================
              We need to show the 'following' tab
              only when the user is connected. So
              we insert it into this links array only
              when user is connected.
            ======================================
          */
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
            label: 'Filter',
            drawer: {
              props: {
                open: isDrawerOpen,
                onClose: closeDrawer,
                title: 'Filter',
                subtitle: 'Select upto 5',
                divide: true
              }
            },
            props: {
              onClick: () => toggleDrawer()
            }
          }
        ]
      }
    }
  };

  const styles = {
    layout: {
      title: 'Analytics',
      padded: true
    },
    container: {
      className: `
        w-full h-full
        bg-theme-light-50
        flex flex-col gap-2
      `
    },
    heading: {
      container: {
        className: `
          w-full h-full overflow-hidden
          bg-theme-light-50
          flex-[0.8]
          grid grid-rows-6 grid-cols-24
        `
      },
      element: {
        className: `
          w-full h-full overflow-hidden
          row-start-4 col-start-1 row-span-3 col-span-14
          text-start font-body font-bold text-[80px] tracking-tight
        `
      }
    },
    options: {
      container: {
        className: `
          w-full h-full overflow-hidden
          bg-theme-light-50
          flex-[0.2]
          grid grid-rows-1 grid-cols-24
        `
      },
      timeframes: {
        group: {
          defaultIndex: content?.options?.timeframes?.findIndex((x) => x.id === interval),
          onChange: (index: number): void => {
            setInterval(content?.options?.timeframes?.[index]?.id);
          }
        },
        container: {
          className: `
            row-start-1 col-start-1 row-span-1 col-span-14
            grid place-items-start items-center
          `
        },
        list: {
          container: {
            className: `
              w-content h-content overflow-hidden
              grid rounded-full
            `
          },
          background: {
            className: `
            w-content h-content overflow-hidden
            bg-theme-light-300
            flex flex-row gap-1 p-1 rounded-full
          `
          }
        },
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
        group: {
          defaultIndex: content?.options?.actions?.links?.findIndex((x) => x.id === page),
          onChange: (index: number): void => {
            setPage(content?.options?.actions?.links?.[index]?.id);
          }
        },
        container: {
          className: `
            w-full h-full overflow-hidden
            bg-theme-light-50
            row-start-1 col-start-13 row-span-1 col-span-12
            flex justify-end gap-2 py-4
          `
        },
        tab: {
          className: ({ selected }: { selected: boolean }) => `
            w-content h-content overflow-hidden
            ${selected ? 'bg-theme-light-900 text-theme-light-50' : 'text-theme-light-800'}
            px-6 py-2 rounded-full
            font-mono font-bold text-sm
          `
        },
        button: {
          className: `
            w-content h-content overflow-hidden
            bg-theme-light-50 text-theme-light-800 ring-1 ring-inset ring-theme-light-700
            hover:bg-theme-light-300 active:bg-theme-light-50
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
          bg-theme-light-50
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
              grid grid-rows-1
              ${
                connected
                  ? 'grid-cols-[3fr,4fr,3fr,3fr,3fr,3fr,3fr,3fr,2fr]'
                  : 'grid-cols-[3fr,4fr,3fr,3fr,3fr,3fr,3fr,2fr]'
              }
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
        container: {
          className: `
            w-full h-full overflow-hidden px-8 pb-8
          `
        },
        grid: {
          className: `
            w-full h-full overflow-hidden grid grid-rows-[10fr,1fr] gap-2
          `
        },
        form: {
          container: {
            className: `
              w-full h-full overflow-hidden flex flex-col gap-1
            `
          },
          row: {
            className: `
              w-full h-full overflow-hidden flex flex-row gap-1
            `
          },
          label: {
            className: `
              w-full h-full overflow-hidden flex-[0.8] flex justify-start items-center text-gray-700 font-mono text-md
            `
          },
          checkbox: {
            container: {
              className: `
                w-full h-full overflow-hidden flex-[0.2] flex justify-center items-center text-gray-700 font-mono text-md
              `
            },
            element: {
              type: 'checkbox'
            }
          }
        },
        actions: {
          container: {
            className: `
              w-full h-full overflow-hidden flex flex-row gap-2 py-2
            `
          }
        }
      }
    }
  };

  return (
    <>
      <Layout {...styles?.layout}>
        <div {...styles?.container}>
          <div {...styles?.heading?.container}>
            {/*
            ====================================
              This is where the heading of
              the page gets rendered.
            ====================================
          */}
            <h1 {...styles?.heading?.element}>{content?.title}</h1>
          </div>
          <div {...styles?.options?.container}>
            <Tab.Group {...styles?.options?.timeframes?.group}>
              <div {...styles?.options?.timeframes?.container}>
                <div {...styles?.options?.timeframes?.list?.container}>
                  <Tab.List {...styles?.options?.timeframes?.list?.background}>
                    {/*
                      ====================================
                        This is where we render the timeframe
                        tabs (clicking on them changes the route
                        params as well, and when they get changed
                        a request to fetch that data is made and cached).
                      ====================================
                    */}
                    {content?.options?.timeframes?.map((tab, i) => (
                      <React.Fragment key={i}>
                        <Tab {...styles?.options?.timeframes?.tab}>{tab?.label}</Tab>
                      </React.Fragment>
                    ))}
                  </Tab.List>
                </div>
              </div>
            </Tab.Group>
            <Tab.Group {...styles?.options?.actions?.group}>
              <Tab.List {...styles?.options?.actions?.container}>
                {/*
                  ====================================
                    After rendering the buttons, we
                    render the links (they determine what
                    kind of data to show, example: trending,
                    following, etc). We need to reverse
                    this array before rendering because we've
                    flex-row-reversed the Tab.List container.
                    This makes it behave weird if we don't reverse
                    the data back.
                  ====================================
                */}
                {content?.options?.actions?.links?.map((link, i) => (
                  <React.Fragment key={i}>
                    <Tab {...styles?.options?.actions?.tab}>{link?.label}</Tab>
                  </React.Fragment>
                ))}
                {/*
                ====================================
                  As for the right side of the actions,
                  starting from the right (because it's a flexbox
                  row-reversed), we first render the action buttons
                  (like  filter and possibly anything else in future).
                ====================================
              */}
                {content?.options?.actions?.buttons?.map((tab, i) => (
                  <React.Fragment key={i}>
                    {tab.type === 'drawer' && (
                      <>
                        <button {...styles?.options?.actions?.button} {...tab?.props}>
                          {tab?.label}
                        </button>
                        <Drawer {...tab?.drawer?.props}>
                          <>
                            <div {...styles?.drawer?.content?.container}>
                              <div {...styles?.drawer?.content?.grid}>
                                <div {...styles?.drawer?.content?.form?.container}>
                                  {content?.filter?.params?.map((x, i) => (
                                    <React.Fragment key={i}>
                                      <div {...styles?.drawer?.content?.form?.row}>
                                        <div {...styles?.drawer?.content?.form?.label}>{x?.label}</div>
                                        <div {...styles?.drawer?.content?.form?.checkbox?.container}>
                                          <input {...styles?.drawer?.content?.form?.checkbox?.element} />
                                        </div>
                                      </div>
                                    </React.Fragment>
                                  ))}
                                </div>
                                <div {...styles?.drawer?.content?.actions?.container}>
                                  <button className="w-full h-full overflow-hidden bg-theme-light-50 ring-1 ring-inset ring-theme-light-700 rounded-full"></button>
                                  <button className="w-full h-full overflow-hidden bg-theme-light-900 ring-1 ring-inset ring-theme-light-900 rounded-full"></button>
                                </div>
                              </div>
                            </div>
                          </>
                        </Drawer>
                      </>
                    )}
                    {tab.type === 'button' && (
                      <>
                        <button {...styles?.options?.actions?.button} {...tab?.props}>
                          {tab?.label}
                        </button>
                      </>
                    )}
                  </React.Fragment>
                ))}
              </Tab.List>
            </Tab.Group>
          </div>
          <div {...styles?.statistics?.container}>
            {/*
              ====================================
                This is where we show the data that
                we get based on the query parameters.
                If data doesn't come out, we show
                skeleton components (same number as that
                of limit - this is important because
                it prevents the page from jumping around on
                route changes).
              ====================================
            */}
            <div {...styles?.statistics?.list?.container}>
              {data.isLoading ? (
                <>
                  {Array.from(Array(limit).keys())?.map((x, i) => (
                    <React.Fragment key={i}>
                      <div {...styles?.statistics?.list?.loading}></div>
                    </React.Fragment>
                  ))}
                </>
              ) : data.isError || content?.statistics?.length === 0 ? (
                <>
                  {Array.from(Array(limit).keys())?.map((x, i) => (
                    <React.Fragment key={i}>
                      <div {...styles?.statistics?.list?.error}></div>
                    </React.Fragment>
                  ))}
                </>
              ) : (
                <>
                  {content?.statistics?.map((stat, i) => (
                    <React.Fragment key={i}>
                      <div {...styles?.statistics?.list?.item?.container}>
                        {stat?.map((field, j) => (
                          <React.Fragment key={j}>
                            <div {...styles?.statistics?.list?.item?.field?.container}>
                              <Field type={field?.type} label={field?.label} value={field?.value} />
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    </React.Fragment>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Analytics;
