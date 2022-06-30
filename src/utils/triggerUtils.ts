import { apiGet } from './apiUtils';

// todo: remove this file once the social-listener repo deployed & running.

const STATS_BASE_URL = '/collections/stats';
const statsEndpoints = [
  `${STATS_BASE_URL}?period=daily&queryBy=by_sales_volume`,
  `${STATS_BASE_URL}?period=weekly&queryBy=by_sales_volume`,
  `${STATS_BASE_URL}?period=monthly&queryBy=by_sales_volume`,
  `${STATS_BASE_URL}?period=daily&queryBy=by_avg_price`,
  `${STATS_BASE_URL}?period=weekly&queryBy=by_avg_price`,
  `${STATS_BASE_URL}?period=monthly&queryBy=by_avg_price`
];
let statsEndpointsIdx = -1;

const PAUSE_BETWEEN_CALLS = 30 * 1000;
// const PAUSE_BEFORE_REPEAT = 2 * 3600 * 1000; // repeat every 2 hours

// periodically trigger Stats endpoints silently so backend can cache them for all users.
export function triggerStatsRequests() {
  setTimeout(invokeStatsEndpoints, PAUSE_BETWEEN_CALLS);
}

export function invokeStatsEndpoints() {
  statsEndpointsIdx++;
  if (statsEndpointsIdx < statsEndpoints.length) {
    const url = statsEndpoints[statsEndpointsIdx];
    apiGet(url);
    setTimeout(invokeStatsEndpoints, PAUSE_BETWEEN_CALLS);
  } else {
    // done triggering all endpoints => pause & reset back to the beginning:
    // setTimeout(() => {
    //   statsEndpointsIdx = -1;
    //   setTimeout(invokeStatsEndpoints, PAUSE_BETWEEN_CALLS);
    // }, PAUSE_BEFORE_REPEAT);
  }
}
