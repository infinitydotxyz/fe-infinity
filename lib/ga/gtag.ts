export const GA_TRACKING_ID =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID_PROD
    : process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID_DEV ?? '';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL): void => {
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
  (window as any).gtag('event', action, {
    event_category: category,
    event_label: label,
    value
  });
};
