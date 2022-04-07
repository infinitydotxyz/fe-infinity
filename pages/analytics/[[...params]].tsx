import React from 'react';
import { Tab } from '@headlessui/react';
import { Layout } from 'src/components/analytics/layout';
import { Field } from 'src/components/analytics/field';
import { useFetch } from 'src/utils/apiUtils';
import { useRouter } from 'next/router';
import { useAppContext } from 'src/utils/context/AppContext';
import { CollectionStats } from '@infinityxyz/lib/types/core';
export const Analytics = () => {
  const router = useRouter();
  const { user } = useAppContext();
  const connected = user?.address ? true : false;
  const [page, setPage] = React.useState(router.query.params?.[0] ? router.query.params?.[0] : 'trending');
  const [interval, setInterval] = React.useState(router.query.params?.[1] ? router.query.params?.[1] : 'hourly');
  const [date, setDate] = React.useState(Date.now());

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
      ? `/collections/rankings?orderBy=volume&orderDirection=desc&period=${interval}&date=${date}&limit=10`
      : `/user/${user?.address}/watchlist?orderBy=discordFollowers&orderDirection=desc&period=${interval}&date=${date}&limit=10`;

  const data = useFetch<{ data: CollectionStats[] }>(query);

  if (data.result) {
    statistics = data.result.data.map((d) => {
      const name = d.name;
      const image = d.profileImage;
      const trust = d.votesFor > 0 ? `${(d.votesFor / (d.votesAgainst + d.votesFor)) * 100}%` : '0%';
      const items = d.numNfts ? d.numNfts : '-';
      const owners = d.numOwners ? d.numOwners : '-';
      const volume = d.volume ? d.volume : '-';
      const floorPrice = d.floorPrice ? d.floorPrice : `-`;
      return [
        {
          type: 'image',
          value: image
        },
        {
          type: 'string',
          value: name
        },
        {
          label: 'Trust',
          type: 'percentage',
          value: trust
        },
        {
          label: 'Items',
          type: 'number',
          value: items.toLocaleString()
        },
        {
          label: 'Owners',
          type: 'number',
          value: owners.toLocaleString()
        },
        {
          label: 'Floor Price',
          type: 'number',
          value: floorPrice.toLocaleString()
        },
        {
          label: 'Volume',
          type: 'number',
          value: volume.toLocaleString()
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
    router.push(`/analytics/${page}/${interval}`);
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
            : []),
          {
            type: 'link',
            id: 'trending',
            url: `/analytics/trending/${interval}`,
            label: 'Trending',
            props: {}
          }
        ],
        buttons: [
          {
            type: 'button',
            url: '',
            label: 'Filter',
            props: {}
          }
        ]
      }
    }
  };

  /*
    ======================================
      Whenever page or interval changes,
      (which they do because tabs in this page
      are actually links that pass in query parameters),
      we make
    ======================================
  */

  const styles = {
    layout: {
      title: 'Analytics'
    },
    container: {
      className: `
        w-full h-full
        bg-theme-light-50
        flex flex-col
      `
    },
    heading: {
      container: {
        className: `
          w-full h-full overflow-hidden
          bg-theme-light-50
          flex-[0.8]
          grid grid-rows-8 grid-cols-24
        `
      },
      element: {
        className: `
          w-full h-full overflow-hidden
          row-start-5 col-start-3 row-span-3 col-span-12
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
            w-full h-full overflow-hidden
            bg-theme-light-50
            row-start-1 col-start-3 row-span-1 col-span-10
            flex flex-row gap-2 py-4
          `
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
            row-start-1 col-start-13 row-span-1 col-span-10
            flex flex-row-reverse gap-2 py-4
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
            hover:bg-theme-light-200 active:bg-theme-light-50
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
            row-start-1 col-start-3 row-span-1 col-span-20
            flex flex-col gap-4
          `
        },
        item: {
          container: {
            className: `
              w-full h-full min-h-[170px] overflow-hidden rounded-xl
              bg-theme-light-300
              grid grid-rows-1
              ${connected ? 'grid-cols-[2fr,6fr,6fr,3fr,3fr,3fr,3fr,2fr]' : 'grid-cols-[2fr,7fr,7fr,3fr,3fr,3fr,3fr]'}
              place-items-center
            `
          },
          field: {
            container: {
              className: `
                w-full h-full
                row-span-1 col-span-1
              `
            },
            image: {
              className: `
                w-full h-full
                row-span-1 col-span-1
                bg-red-200
              `
            },
            name: {
              className: `
                w-full h-full
                row-span-1 col-span-1
                bg-blue-200
              `
            }
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
              <Tab.List {...styles?.options?.timeframes?.container}>
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
            </Tab.Group>
            <Tab.Group {...styles?.options?.actions?.group}>
              <Tab.List {...styles?.options?.actions?.container}>
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
                    <button {...styles?.options?.actions?.button}>{tab?.label}</button>
                  </React.Fragment>
                ))}
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
              </Tab.List>
            </Tab.Group>
          </div>
          <div {...styles?.statistics?.container}>
            {/*
              ====================================
                This is where we show the data that
                we get based on the query parameters.
              ====================================
            */}
            <div {...styles?.statistics?.list?.container}>
              {data.isLoading ? (
                <>
                  <div className="w-full h-[170px] bg-blue-50 rounded-xl"></div>
                  <div className="w-full h-[170px] bg-blue-50 rounded-xl"></div>
                  <div className="w-full h-[170px] bg-blue-50 rounded-xl"></div>
                </>
              ) : data.isError || content?.statistics?.length === 0 ? (
                <>
                  <div className="w-full h-[170px] bg-red-50 rounded-xl"></div>
                  <div className="w-full h-[170px] bg-red-50 rounded-xl"></div>
                  <div className="w-full h-[170px] bg-red-50 rounded-xl"></div>
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
