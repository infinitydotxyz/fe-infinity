export enum ScatterChartType {
  Sales = 'Sales',
  SalesAndOrders = 'Sales & Orders'
}

export enum BarChartType {
  Orders = 'Orders',
  Listings = 'Listings',
  Bids = 'Bids'
}

export type SalesAndOrdersDataPointType = 'Sale' | 'Listing' | 'Offer';
