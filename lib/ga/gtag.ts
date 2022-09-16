export const GA_TRACKING_ID: string = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID_PROD ?? '';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).gtag('config', GA_TRACKING_ID, {
    page_path: url
  });
};

type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value: number;
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: GTagEvent): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).gtag('event', action, {
    event_category: category,
    event_label: label,
    value
  });
};
