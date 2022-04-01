/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { Tab } from '@headlessui/react';
import { useRouter } from 'next/router';
import Layout from 'src/components/analytics/layout';

export const Analytics = () => {
  const router = useRouter();
  const page = router.query.params?.[0] ? router.query.params?.[0] : 'trending';
  const interval = router.query.params?.[1] ? router.query.params?.[1] : '1h';

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
    statistics: [
      {
        id: 1,
        name: 'NFT Collection Name',
        fields: [
          {
            label: 'Trust',
            type: 'percentage',
            value: '11%'
          },
          {
            label: 'Items',
            type: 'number',
            value: 25048
          },
          {
            label: 'Owners',
            type: 'number',
            value: 8102
          },
          {
            label: 'Floor Price',
            type: 'number',
            value: 62340
          },
          {
            label: 'Volume',
            type: 'percentage',
            value: 10345
          }
        ]
      },
      {
        id: 2,
        name: 'NFT Collection Name',
        fields: [
          {
            label: 'Trust',
            type: 'percentage',
            value: '11%'
          },
          {
            label: 'Items',
            type: 'number',
            value: 25048
          },
          {
            label: 'Owners',
            type: 'number',
            value: 8102
          },
          {
            label: 'Floor Price',
            type: 'number',
            value: 62340
          },
          {
            label: 'Volume',
            type: 'percentage',
            value: 10345
          }
        ]
      },
      {
        id: 3,
        name: 'NFT Collection Name',
        fields: [
          {
            label: 'Trust',
            type: 'percentage',
            value: '11%'
          },
          {
            label: 'Items',
            type: 'number',
            value: 25048
          },
          {
            label: 'Owners',
            type: 'number',
            value: 8102
          },
          {
            label: 'Floor Price',
            type: 'number',
            value: 62340
          },
          {
            label: 'Volume',
            type: 'percentage',
            value: 10345
          }
        ]
      }
    ],
    options: {
      timeframes: [
        {
          type: 'tab',
          id: '1h',
          url: `/analytics/${page}/1h`,
          label: '1 hr',
          props: {}
        },
        {
          type: 'tab',
          id: '1d',
          url: `/analytics/${page}/1d`,
          label: '1 day',
          props: {}
        },
        {
          type: 'tab',
          id: '7d',
          url: `/analytics/${page}/7d`,
          label: '7 days',
          props: {}
        },
        {
          type: 'tab',
          id: '30d',
          url: `/analytics/${page}/30d`,
          label: '30 days',
          props: {}
        },
        {
          type: 'tab',
          id: 'total',
          url: `/analytics/${page}/total`,
          label: 'All',
          props: {}
        }
      ],
      actions: [
        {
          type: 'button',
          url: '',
          label: 'Filter',
          props: {}
        },
        {
          type: 'link',
          id: 'trending',
          url: `/analytics/trending/${interval}`,
          label: 'Trending',
          props: {}
        },
        {
          type: 'link',
          id: 'following',
          url: `/analytics/following/${interval}`,
          label: 'Following ',
          props: {}
        }
      ]
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
        w-full h-full overflow-hidden
        bg-theme-light-50
        grid grid-rows-24 grid-cols-24
      `
    },
    heading: {
      container: {
        className: `
          w-full h-full overflow-hidden
          bg-theme-light-50
          row-start-1 col-start-1 row-span-8 col-span-24
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
          row-start-9 col-start-1 row-span-2 col-span-24
          grid grid-rows-1 grid-cols-24
        `
      },
      timeframes: {
        group: {
          defaultIndex: content?.options?.timeframes?.findIndex((x) => x.id === interval),
          selectedIndex: content?.options?.timeframes?.findIndex((x) => x.id === interval)
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
          defaultIndex: content?.options?.actions?.findIndex((x) => x.id === page),
          selectedIndex: content?.options?.actions?.findIndex((x) => x.id === page)
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
          row-start-11 col-start-1 row-span-14 col-span-24
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
              w-full h-full min-h-[170px] rounded-xl
              bg-theme-light-300
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
                    <Link passHref href={tab.url}>
                      <Tab {...styles?.options?.timeframes?.tab}>{tab?.label}</Tab>
                    </Link>
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
                {content?.options?.actions
                  ?.filter((x) => x.type === 'button')
                  ?.map((tab, i) => (
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
                {content?.options?.actions
                  ?.filter((x) => x.type === 'link')
                  ?.reverse()
                  ?.map((link, i) => (
                    <React.Fragment key={i}>
                      <Link passHref href={link.url}>
                        <Tab {...styles?.options?.actions?.tab}>{link?.label}</Tab>
                      </Link>
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
              {content?.statistics?.map((data, i) => (
                <React.Fragment key={i}>
                  <div {...styles?.statistics?.list?.item?.container}></div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Analytics;
