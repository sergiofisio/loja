import ReactGA from 'react-ga';

const TRACKING_ID = "G-Q8LM71828M";
ReactGA.initialize(TRACKING_ID);

export const trackPageView = (page) => {
  ReactGA.set({ page });
  ReactGA.pageview(page);
};